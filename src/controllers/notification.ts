import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import notificationModel from "../models/notification";
import mongoose from "mongoose";

export const getMyNotifications = async (req: Request, res: Response) => {
  const receiverId = req.userId;

  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const notifications = await notificationModel
      .find({ receiverId })
      .populate({
        path: "initiatorUser",
        select: "name",
      })
      .skip((page - 1) * limit)
      .limit(limit);

    let totalDocs = await notificationModel.count({ receiverId }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: notifications,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Notifications", error);
  }
};

export const updateReadNotificationById = async (
  req: Request,
  res: Response
) => {
  const notificationId = req.params.notificationId;
  const { read } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: "invalid notification id" });
    }
    const message = await notificationModel.findById(notificationId);
    if (!message) {
      return res.status(404).json({ error: "404 notification not found" });
    }

    const messageUpdated = await notificationModel.findByIdAndUpdate(
      notificationId,
      { read },
      { new: true }
    );

    res.status(200).json(messageUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Messages", error);
  }
};
