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

export const updateReviewStatusById = async (req: Request, res: Response) => {
  const { status } = req.body;
  const userId = req.userId;
  const reviewId = req.params.reviewId;

  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "invalid review Id" });
    }
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        error: "review not found",
      });
    }

    const rewiewUpdated = await reviewModel.findByIdAndUpdate(
      reviewId,
      {
        status,
      },
      {
        new: true,
      }
    );
    res.status(201).json(rewiewUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Review", error);
  }
};
