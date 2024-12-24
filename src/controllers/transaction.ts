import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { Types } from "mongoose";
import balanceTransactionModel from "../models/balanceTransaction";
import { getTotalBalance } from "../services/transaction";

export const getMyBalance = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const totalBalance = await getTotalBalance(userId);

    res.status(200).json({
      totalBalance,
      currency: "USD",
    });
  } catch (error) {
    handleHttp(res, "Error_Upload_Photo", error);
  }
};
export const getMyTransactions = async (req: Request, res: Response) => {
  const userId = req.userId;
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "invalid user id" });
    }

    const transactions = await balanceTransactionModel
      .find({
        userId,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    let totalDocs = await balanceTransactionModel.count(); //Possible performance improvement: cache the value
    const totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: transactions,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_My_Sales", error);
  }
};
