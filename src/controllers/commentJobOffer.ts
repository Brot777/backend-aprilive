import { Request, Response } from "express";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import jobOfferModel from "../models/jobOffer";
import commentJobOfferModel from "./../models/commentJobOffer";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { jobOfferId } = req.params;
    const commentJobOffer = req.body;
    const jobOffer = await jobOfferModel.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({
        error: "No se puede crear el comentario, 404 job offer not found",
      });
    }
    commentJobOffer.jobOfferId = jobOfferId;
    const commentSaved = await commentJobOfferModel.create(commentJobOffer);
    res.status(201).json(commentSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Comment_Job_Offer", error);
  }
};

export const getCommentsByJobOfferId = async (req: Request, res: Response) => {
  try {
    const { jobOfferId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobOfferId)) {
      return res.status(400).json({ error: "Invalid job Offer id" });
    }
    const commentsJobOffer = await commentJobOfferModel
      .find({ jobOfferId })
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

    res.status(200).json(commentsJobOffer);
  } catch (error) {
    handleHttp(res, "Error_Get_Comments_By_Job_Offer_Id", error);
  }
};

export const updateCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment Id" });
    }
    const comment = await commentJobOfferModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "404, job offernot found" });
    }

    const commentUpdated = await commentJobOfferModel.findByIdAndUpdate(
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
    const comment = await commentJobOfferModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "404 job offer not found" });
    }

    await commentJobOfferModel.findByIdAndDelete(commentId);

    res.status(200).json({ msj: "comment successfully deleted" });
  } catch (error) {
    handleHttp(res, "Error_Delete_Comment", error);
  }
};
