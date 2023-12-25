import { Request, Response } from "express";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import serviceModel from "../models/service";
import commentServiceModel from "./../models/commentService";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const commentService = req.body;
    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ error: "Cannot create comment, 404 not found" });
    }
    commentService.serviceId = serviceId;
    const commentSaved = await commentServiceModel.create(commentService);
    res.status(201).json(commentSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Comment_Service", error);
  }
};

export const getCommentsByServiceId = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.serviceId;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: "Invalid service id" });
    }
    const commentsService = await commentServiceModel
      .find({ serviceId })
      .populate({
        path: "authorId",
        select: "photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "authorId",
        select: "name isCompany accountType",
        populate: {
          path: "accountType",
          select: "role",
          populate: {
            path: "role",
            select: "name",
          },
        },
      });

    res.status(200).json(commentsService);
  } catch (error) {
    handleHttp(res, "Error_Get_Comments_By_Service_Id", error);
  }
};

export const updateCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment Id" });
    }
    const comment = await commentServiceModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "404 comment not found" });
    }

    const commentUpdated = await commentServiceModel.findByIdAndUpdate(
      commentId,
      req.body,
      { new: true }
    );

    res.status(200).json(commentUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Comment", error);
  }
};

export const deleteCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment Id" });
    }
    const comment = await commentServiceModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "404, comment not found" });
    }

    await commentServiceModel.findByIdAndDelete(commentId);

    res.status(200).json({ msj: "comment successfully deleted" });
  } catch (error) {
    handleHttp(res, "Error_Delete_Comment", error);
  }
};
