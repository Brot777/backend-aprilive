import mongoose, { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleHttp } from "../utils/error.handle";
import { serviceHiringModel } from "../models/serviceHiring";
import disputeModel from "../models/dispute";
import { Service } from "../interfaces/service";
import notificationModel from "../models/notification";
import { getSocketIdByUserId, io } from "../socket/socket";

export const createDisputeByServiceHiringId = async (
  req: Request,
  res: Response
) => {
  const serviceHiringId = req.params.serviceHiringId;
  const InitiatorId = req.userId;
  const { description } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceHiringId)) {
      return res.status(400).json({ error: "invalid dispute id" });
    }
    const serviceHiring = await serviceHiringModel
      .findById(serviceHiringId)
      .populate({
        path: "serviceId",
        select: "authorId",
      })
      .lean();
    if (!serviceHiring) {
      return res.status(404).json({ error: "404 service hiring not found" });
    }
    const service = serviceHiring.serviceId as Service;
    const authorId = service.authorId as ObjectId;
    const disputeId = `dispute_${uuidv4()}`;
    const disputeSaved = await disputeModel.create({
      disputeId,
      serviceHiringId,
      description,
    });
    const disputeFind = await disputeModel
      .findById(disputeSaved._id)
      .populate("serviceId");

    // REAL TIME
    const notificationSaved = await notificationModel.create({
      description: "Un usuario inicio una disputa para el servicio contratado",
      type: "dispute",
      referenceId: disputeSaved._id,
      receiverId: authorId,
    });
    const reseiverSocketId = getSocketIdByUserId(authorId);

    if (reseiverSocketId)
      io.to(reseiverSocketId).emit("newNotification", notificationSaved);
    // FINISH REAL TIME

    res.status(200).json(disputeFind);
  } catch (error) {
    handleHttp(res, "Error_Apply_Job_Offer", error);
  }
};
