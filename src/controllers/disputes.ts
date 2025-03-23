import mongoose, { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleHttp } from "../utils/error.handle";
import { serviceHiringModel } from "../models/serviceHiring";
import { disputeModel } from "../models/dispute";
import { Service } from "../interfaces/service";
import notificationModel from "../models/notification";
import { getSocketIdByUserId, io } from "../socket/socket";

export const createDisputeByServiceHiringId = async (
  req: Request,
  res: Response
) => {
  const serviceHiringId = req.params.serviceHiringId;
  const customerId = req.userId;
  const { description, reason } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceHiringId)) {
      return res.status(400).json({ error: "invalid serviceHiring id" });
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
    const key = `dispute_${uuidv4()}`;
    const disputeSaved = await disputeModel.create({
      key,
      serviceHiringId,
      description,
      status: "waiting_seller_response",
      customerId,
      sellerId: authorId,
      reason,
    });
    /* const disputeFind = await disputeModel
      .findById(disputeSaved._id)
      .populate("serviceHiringId");
 */
    // REAL TIME
    const notificationSaved = await notificationModel.create({
      description:
        "Un usuario inicio una disputa para una de tus contrataciones",
      type: "dispute",
      referenceId: disputeSaved._id,
      receiverId: authorId,
    });
    const reseiverSocketId = getSocketIdByUserId(authorId);

    if (reseiverSocketId)
      io.to(reseiverSocketId).emit("newNotification", notificationSaved);
    // FINISH REAL TIME

    res.status(200).json(disputeSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Dispute", error);
  }
};

export const getCustomerDisputes = async (req: Request, res: Response) => {
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  const customerId = req.userId;
  try {
    const disputes = await disputeModel
      .find({ customerId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "serviceHiringId",
        select: "serviceId totalAmount",
        populate: {
          path: "serviceId",
        },
      });

    let totalDocs = await disputeModel.count({ customerId }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: disputes,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Customer_Disputes", error);
  }
};

export const getSellerDisputes = async (req: Request, res: Response) => {
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  const sellerId = req.userId;
  try {
    const disputes = await disputeModel
      .find({ sellerId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "serviceHiringId",
        select: "serviceId totalAmount",
        populate: {
          path: "serviceId",
        },
      });

    let totalDocs = await disputeModel.count({ sellerId }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: disputes,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Seller_Disputes", error);
  }
};

export const updateSellerResponseById = async (req: Request, res: Response) => {
  const disputeId = req.params.disputeId;
  const customerId = req.userId;
  const { sellerAccept } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(disputeId)) {
      return res.status(400).json({ error: "invalid dispute id" });
    }
    const dispute = await disputeModel.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ error: "404 dispute not found" });
    }

    const disputeUpdated = await disputeModel.findByIdAndUpdate(
      disputeId,
      {
        $set: {
          sellerAccept,
        },
      },
      { new: true }
    );

    res.status(200).json(disputeUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Response_Seller", error);
  }
};
export const updateGeneralStatusById = async (req: Request, res: Response) => {
  const disputeId = req.params.disputeId;
  const customerId = req.userId;
  const { status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(disputeId)) {
      return res.status(400).json({ error: "invalid dispute id" });
    }
    const dispute = await disputeModel.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ error: "404 dispute not found" });
    }

    const disputeUpdated = await disputeModel.findByIdAndUpdate(
      disputeId,
      {
        $set: {
          status,
        },
      },
      { new: true }
    );

    res.status(200).json(disputeUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_General_Status", error);
  }
};
