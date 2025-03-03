import mongoose, { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleHttp } from "../utils/error.handle";
import { serviceHiringModel } from "../models/serviceHiring";
import disputeModel from "../models/dispute";

export const createDisputeByServiceHiringId = async (
  req: Request,
  res: Response
) => {
  const serviceHiringId = req.params.serviceHiringId;
  const applicantId = req.userId;
  const { description } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceHiringId)) {
      return res.status(400).json({ error: "invalid dispute id" });
    }
    const serviceHiring = await serviceHiringModel.findById(serviceHiringId);
    if (!serviceHiring) {
      return res.status(404).json({ error: "404 service hiring not found" });
    }
    const disputeId = `payout_${uuidv4()}`;
    const disputeSaved = await disputeModel.create({
      disputeId,
      serviceHiringId,
      description,
    });
    const disputeFind = await disputeModel
      .findById(disputeSaved._id)
      .populate("serviceId");

    // REAL TIME
    /* const notificationSaved = await notificationModel.create({
      description: "Alguien aplico a tu oferta de trabajo",
      type: "dispute",
      referenceId: jobOfferId,
      receiverId: authorId,
    });
    const reseiverSocketId = getSocketIdByUserId(authorId);

    if (reseiverSocketId)
      io.to(reseiverSocketId).emit("newNotification", notificationSaved); */
    // FINISH REAL TIME

    res.status(200).json(disputeFind);
  } catch (error) {
    handleHttp(res, "Error_Apply_Job_Offer", error);
  }
};
