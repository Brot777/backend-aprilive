import { Request, Response } from "express";
import mongoose from "mongoose";
import userModel from "../models/user";
import followerModel from "../models/follower";
import { handleHttp } from "../utils/error.handle";
import notificationModel from "../models/notification";
import { getSocketIdByUserId, io } from "../socket/socket";

export const followById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const followerId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid Id" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "404 user not found" });
    }
    if (userId == followerId) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }
    const isFollower = await followerModel.findOne({ userId, followerId }); //return document Follower or null
    if (isFollower) {
      await followerModel.findByIdAndDelete(isFollower._id);
    } else {
      await followerModel.create({ userId, followerId });
      // REAL TIME
      const notificationSaved = await notificationModel.create({
        description: `Tienes un nuevo seguidor`,
        type: "follow",
        referenceId: followerId,
        receiverId: userId,
      });
      const reseiverSocketId = getSocketIdByUserId(userId);

      if (reseiverSocketId)
        io.to(reseiverSocketId).emit("newNotification", notificationSaved);
      // FINISH REAL TIME
    }
    res.status(201).json({ follow: Boolean(!isFollower) });
  } catch (error) {
    handleHttp(res, "Error_Following_User", error);
  }
};

export const dataFollow = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const followerId = req.userId;
  try {
    const [following, numberFollowers, numberFollowing] = await Promise.all([
      followerModel.findOne({ userId, followerId }),
      followerModel.count({ userId }),
      followerModel.count({ followerId: userId }),
    ]);
    return res.status(200).json({
      following: Boolean(following),
      numberFollowers,
      numberFollowing,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Data_Follow", error);
  }
};
