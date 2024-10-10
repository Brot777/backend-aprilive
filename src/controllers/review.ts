import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceModel from "../models/service";
import reviewModel from "../models/review";
import mongoose from "mongoose";

export const createReviewByServiceId = async (req: Request, res: Response) => {
  let review = req.body;
  const serviceId = req.params.serviceId;
  const userId = req.userId;

  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: "invalid service id" });
    }
    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        error: "service not found",
      });
    }

    const isTheReviewCreated = await reviewModel.findOne({ authorId: userId });
    if (!isTheReviewCreated) {
      return res.status(403).json({
        error: "a review has already been created",
      });
    }

    review.serviceId = serviceId;
    review.authorId = userId;
    const rewiewSaved = await reviewModel.create(review);
    res.status(201).json(rewiewSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Review", error);
  }
};
