import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceModel from "../models/service";
import reviewModel from "../models/review";
import mongoose from "mongoose";

export const updateQuestionsByJobOfferId = async (
  req: Request,
  res: Response
) => {
  const rewiew = req.body;
  const serviceId = req.params.serviceId;

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
    const rewiewSaved = await reviewModel.create(rewiew);
    res.status(201).json(rewiewSaved);
  } catch (error) {
    handleHttp(res, "Error_Update_Job_Offer_Questions", error);
  }
};
