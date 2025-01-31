import { Request, Response } from "express";
import subscriptionModel from "../models/subscription";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";

export const getMySubscriptions = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "invalid user id" });
  }
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const subscriptions = await subscriptionModel
      .find({ userId })
      .skip((page - 1) * limit)
      .limit(limit);

    let totalDocs = await subscriptionModel.count({ userId }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: subscriptions,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Subscriptions_By_UserId", error);
  }
};
