import mongoose from "mongoose";
import { Request, Response } from "express";
import { conversationModel } from "../models/conversation";
import { userModel } from "../models/user";
import { handleHttp } from "../utils/error.handle";

export const getMyConversations = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "invalid user id" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "404 user not found" });
    }

    const conversations = await conversationModel
      .find({
        participants: { $in: [userId] },
      })
      .populate({
        path: "participants",
        select: "name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate("lastMessage");
    res.status(200).json(conversations);
  } catch (error) {
    handleHttp(res, "Error_Get_Messages", error);
  }
};
