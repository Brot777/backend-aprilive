import mongoose from "mongoose";
import { Request, Response } from "express";

import messageModel from "../models/message";
import conversationModel from "../models/conversation";
import userModel from "../models/user";
import { handleHttp } from "../utils/error.handle";

export const sendMessage = async (req: Request, res: Response) => {
  const receiverId = req.params.receiverId;
  const senderId = req.userId;
  let { conversationId, value } = req.body;
  console.log(receiverId, conversationId, value, senderId);

  try {
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "invalid receiver id" });
    }
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "404 receiver not found" });
    }

    if (!conversationId) {
      console.log("no hay conversacion todavia");

      const conversationSaved = await conversationModel.create({
        participants: [senderId, receiverId],
      });
      conversationId = conversationSaved._id;
    }

    const messageSaved = await messageModel.create({
      conversationId,
      receiverId,
      senderId,
      value,
    });

    await conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: messageSaved._id,
    });
    res.status(200).json(messageSaved);
  } catch (error) {
    handleHttp(res, "Error_Send_Message", error);
  }
};

export const getMessagesByReceiverId = async (req: Request, res: Response) => {
  const receiverId = req.params.receiverId;
  const senderId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "invalid receiver id" });
    }
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "404 receiver not found" });
    }

    const messages = await messageModel.find({
      $or: [
        { $and: [{ receiverId: receiverId }, { senderId: senderId }] },
        { $and: [{ receiverId: senderId }, { senderId: receiverId }] },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    handleHttp(res, "Error_Get_Messages", error);
  }
};
