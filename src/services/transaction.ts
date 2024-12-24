import { Types } from "mongoose";
import balanceTransactionModel from "../models/balanceTransaction";

export const getTotalBalance = async (userId: string) => {
  const arrayTotalBalance = await balanceTransactionModel.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
      },
    },
    {
      $addFields: {
        numAmount: { $toDouble: "$amount" }, // Convierte el monto a número
      },
    },
    {
      $project: {
        numAmount: {
          $cond: [
            { $eq: ["$increase", true] },
            "$numAmount",
            { $multiply: ["$numAmount", -1] },
          ],
        },
      },
    },

    {
      $group: {
        _id: null,
        total: { $sum: "$numAmount" },
      },
    },
  ]);

  return arrayTotalBalance.length > 0 ? arrayTotalBalance[0].total : 0;
};
