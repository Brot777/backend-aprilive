import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import reviewModel from "../models/review";
import mongoose from "mongoose";
import serviceHiringModel from "../models/serviceHiring";

export const createReviewByServiceHiringId = async (
  req: Request,
  res: Response
) => {
  let review = req.body;
  const userId = req.userId;
  const serviceHiringId = req.params.serviceHiringId;

  try {
    if (!mongoose.Types.ObjectId.isValid(serviceHiringId)) {
      return res.status(400).json({ error: "invalid service hiring id" });
    }
    const serviceHiring = await serviceHiringModel.findById(serviceHiringId);
    if (!serviceHiring) {
      return res.status(404).json({
        error: "service hiring not found",
      });
    }

    review.serviceHiringId = serviceHiringId;
    review.serviceId = serviceHiring.serviceId;
    review.authorId = userId;
    const rewiewSaved = await reviewModel.create(review);
    res.status(201).json(rewiewSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Review", error);
  }
};
