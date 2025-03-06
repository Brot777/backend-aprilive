import mongoose from "mongoose";
import { Request, Response } from "express";
import { messageModel, requestQuoteModel, quoteModel } from "../models/message";
import { conversationModel } from "../models/conversation";
import userModel from "../models/user";
import { handleHttp } from "../utils/error.handle";
import { getSocketIdByUserId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response) => {
  const receiverId = req.params.receiverId;
  const senderId = req.userId;
  const { value } = req.body;
  let conversationId;

  try {
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "invalid receiver id" });
    }
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "404 receiver not found" });
    }

    const conversation = await conversationModel.findOne({
      participants: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
      console.log("no hay conversacion todavia");

      const conversationSaved = await conversationModel.create({
        participants: [senderId, receiverId],
      });
      conversationId = conversationSaved._id;
    } else {
      conversationId = conversation._id;
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

    const reseiverSocketId = getSocketIdByUserId(receiverId);

    if (reseiverSocketId) {
      const message = await messageModel.findById(messageSaved._id).populate({
        path: "senderId",
        select: "name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      });
      io.to(reseiverSocketId).emit("newMessage", message);
    }

    res.status(200).json(messageSaved);
  } catch (error) {
    handleHttp(res, "Error_Send_Message", error);
  }
};
export const sendRequesQuote = async (req: Request, res: Response) => {
  const receiverId = req.params.receiverId;
  const senderId = req.userId;
  const { value, serviceId, serviceTitle } = req.body;
  let conversationId;

  try {
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "invalid receiver id" });
    }
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "404 receiver not found" });
    }

    const conversation = await conversationModel.findOne({
      participants: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
      console.log("no hay conversacion todavia");

      const conversationSaved = await conversationModel.create({
        participants: [senderId, receiverId],
      });
      conversationId = conversationSaved._id;
    } else {
      conversationId = conversation._id;
    }

    const messageSaved = await requestQuoteModel.create({
      conversationId,
      receiverId,
      senderId,
      value,
      serviceId,
      serviceTitle,
    });

    await conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: messageSaved._id,
    });

    const reseiverSocketId = getSocketIdByUserId(receiverId);

    if (reseiverSocketId) {
      const message = await messageModel.findById(messageSaved._id).populate({
        path: "senderId",
        select: "name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      });
      io.to(reseiverSocketId).emit("newMessage", message);
    }

    res.status(200).json(messageSaved);
  } catch (error) {
    handleHttp(res, "Error_Send_Message", error);
  }
};
export const sendQuote = async (req: Request, res: Response) => {
  const receiverId = req.params.receiverId;
  const senderId = req.userId;
  const {
    value,
    serviceId,
    serviceTitle,
    totalHours,
    pricePerHour,
    totalAmount,
    estimatedDeliveryDate,
  } = req.body;
  let conversationId;

  try {
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "invalid receiver id" });
    }
    const estimatedDeliveryDateObj = new Date(estimatedDeliveryDate);
  /*   const nowOBj = new Date();
    if (nowOBj > estimatedDeliveryDateObj) {
      return res
        .status(400)
        .json({ error: "la fecha estimada debe ser mayor a la fecha atual" });
    } */
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "404 receiver not found" });
    }

    const conversation = await conversationModel.findOne({
      participants: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
      console.log("no hay conversacion todavia");

      const conversationSaved = await conversationModel.create({
        participants: [senderId, receiverId],
      });
      conversationId = conversationSaved._id;
    } else {
      conversationId = conversation._id;
    }

    const messageSaved = await quoteModel.create({
      conversationId,
      receiverId,
      senderId,
      value,
      serviceId,
      serviceTitle,
      totalHours,
      pricePerHour,
      totalAmount,
      estimatedDeliveryDate,
    });

    await conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: messageSaved._id,
    });

    const reseiverSocketId = getSocketIdByUserId(receiverId);

    if (reseiverSocketId) {
      const message = await messageModel.findById(messageSaved._id).populate({
        path: "senderId",
        select: "name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      });
      io.to(reseiverSocketId).emit("newMessage", message);
    }

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
export const updateReadMessageById = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const { read } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: "invalid message id" });
    }
    const message = await messageModel.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "404 message not found" });
    }

    const messageUpdated = await messageModel.findByIdAndUpdate(
      messageId,
      { read },
      { new: true }
    );

    res.status(200).json(messageUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Messages", error);
  }
};
