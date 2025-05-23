import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user";
import subscriptionModel from "../models/subscription";

export const verifyActiveSubcription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  try {
    const now = new Date();

    const isActiveSubcription = await subscriptionModel.findOne({
      userId,
      startedAt: { $lte: now },
      finishAt: { $gte: now },
    });

    if (isActiveSubcription) {
      return res
        .status(400)
        .json({ error: "you already have an active subscription" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};
