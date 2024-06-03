import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import notificationModel from "../models/notification";

export const getMyNotifications = async (req: Request, res: Response) => {
  const receiverId = req.userId;

  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const notifications = await notificationModel
      .find({ receiverId })
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
