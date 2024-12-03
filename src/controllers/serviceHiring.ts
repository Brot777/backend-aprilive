import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceHiringModel from "../models/serviceHiring";
import mongoose from "mongoose";

export const getMyServiceHiring = async (req: Request, res: Response) => {
  const customerId = req.userId;
  try {
    const serviceHirings = await serviceHiringModel
      .find({ customerId })
      .populate("reviewId")
      .populate({
        path: "serviceId",
        select: "authorId title",
        populate: {
          path: "authorId",
          select: "_id name photoUrl",
          populate: {
            path: "photoUrl",
            select: "url",
          },
        },
      });

    return res.status(200).json(serviceHirings);
  } catch (error) {
    handleHttp(res, "Error_Get_Service_Hirings", error);
  }
};

export const updateServiceHiringStatusById = async (
  req: Request,
  res: Response
) => {
  const { status } = req.body;
  const serviceHiringId = req.params.serviceHiringId;

  try {
    if (!mongoose.Types.ObjectId.isValid(serviceHiringId)) {
      return res.status(400).json({ error: "invalid service hiring Id" });
    }
    const serviceHiring = await serviceHiringModel.findById(serviceHiringId);
    if (!serviceHiring) {
      return res.status(404).json({
        error: "service hiring not found",
      });
    }

    const serviceHiringUpdated = await serviceHiringModel.findByIdAndUpdate(
      serviceHiringId,
      {
        status,
      },
      {
        new: true,
      }
    );
    res.status(201).json(serviceHiringUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Service_Hiring", error);
  }
};