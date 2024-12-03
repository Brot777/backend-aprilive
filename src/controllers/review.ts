import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceModel from "../models/service";
import reviewModel from "../models/review";
import mongoose from "mongoose";

export const createReviewByServiceHiringId = async (
  req: Request,
  res: Response
) => {
  let review = req.body;
  const userId = req.userId;
  const serviceHiringId = req.params.serviceHiringId;

  try {
    if (!mongoose.Types.ObjectId.isValid(review.serviceId)) {
      return res.status(400).json({ error: "invalid service id" });
    }
    const service = await serviceModel.findById(review.serviceId);
    if (!service) {
      return res.status(404).json({
        error: "service not found",
      });
    }

    review.serviceHiringId = serviceHiringId;
    review.authorId = userId;
    const rewiewSaved = await reviewModel.create(review);
    res.status(201).json(rewiewSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Review", error);
  }
};
