import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user";
import subscriptionModel from "../models/subscription";
import companyAccountModel from "../models/companyAccount";
import jobOfferModel from "../models/jobOffer";

export const verifyActiveSubcription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const now = new Date();
  try {
    const totalJobOffer = await jobOfferModel.count({ authorId: userId });
    const isActiveSubcription = await subscriptionModel.findOne({
      userId,
      startedAt: { $lte: now },
      finishAt: { $gte: now },
    });
    console.log({ isActiveSubcription, totalJobOffer });

    if (totalJobOffer > 1 && !isActiveSubcription) {
      return res.status(402).json({
        error:
          "Necesitas tener una suscripción activa para crear mas ofertas de trabajo",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};
