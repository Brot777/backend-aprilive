import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import reviewModel from "../models/review";
import mongoose from "mongoose";
import { serviceHiringModel } from "../models/serviceHiring";
import serviceModel from "../models/service";
import { Service } from "../interfaces/service";

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
    const serviceHiring = await serviceHiringModel
      .findById(serviceHiringId)
      .populate("serviceId");
    if (!serviceHiring) {
      return res.status(404).json({
        error: "service hiring not found",
      });
    }

    review.serviceHiringId = serviceHiringId;
    const service = serviceHiring.serviceId as Service;
    review.serviceId = service._id;
    review.authorId = userId;
    const reviewSaved = await reviewModel.create(review);

    const currentAverage = service.averageRating;
    const currentTotalReviews = service.numReviews;
    const newAverage =
      (currentAverage * currentTotalReviews + review.value) /
      (currentTotalReviews + 1);
    const newTotalReviws = currentTotalReviews + 1;

    await serviceHiringModel.findByIdAndUpdate(serviceHiringId, {
      reviewId: reviewSaved._id,
    });
    await serviceModel.findByIdAndUpdate(serviceHiring.serviceId, {
      averageRating: newAverage,
      numReviews: newTotalReviws,
    });
    res.status(201).json(reviewSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Review", error);
  }
};
