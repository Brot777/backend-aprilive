import { NextFunction, Request, Response } from "express";
import reviewModel from "../models/review";

export const verrifyReviewCreated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const serviceHiringId = req.params.serviceHiringId;
  try {
    const isTheReviewCreated = await reviewModel.findOne({
      authorId: userId,
      serviceHiringId,
    });
    if (isTheReviewCreated) {
      return res.status(403).json({
        error: "a review has already been created",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};
