import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import notificationModel from "../models/notification";


export const getMyNotifications = async (req: Request, res: Response) => {
  const receiverId = req.userId;
  try {
    const notifications = await notificationModel
      .find({receiverId})
    res.status(200).json(notifications);
  } catch (error) {
    handleHttp(res, "Error_Get_Notifications", error);
  }
};



