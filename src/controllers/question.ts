import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import jobOfferQuestionModel from "../models/jobOfferQuestion";
import mongoose from "mongoose";

export const createQuestionsByJobOfferId = async (
  req: Request,
  res: Response
) => {
  const { questions = [] } = req.body;
  const jobOfferId = req.params.jobOfferId;
  const questionsFormated = questions.map((question: string) => {
    return {
      jobOfferId,
      question,
    };
  });
  try {
    const questionsSaved = await jobOfferQuestionModel.insertMany(
      questionsFormated
    );
    res.status(201).json(questionsSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Job_Offer_Questions", error);
  }
};

export const getQuestionsByJobOfferId = async (req: Request, res: Response) => {
  const jobOfferId = req.params.jobOfferId;
  try {
    const questionsMached = await jobOfferQuestionModel.find({ jobOfferId });
    res.status(200).json(questionsMached);
  } catch (error) {
    handleHttp(res, "Error_Get_Job_Offer_Questions", error);
  }
};

export const updateQuestionsByQuestionId = async (
  req: Request,
  res: Response
) => {
  const question = req.body;
  const questionId = req.params.questionId;
  try {
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: "invalid quesion id" });
    }
    const question = await jobOfferQuestionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "404 question not found" });
    }
    const questionUpdated = await jobOfferQuestionModel.findByIdAndUpdate(
      questionId,
      question,
      { new: true }
    );
    res.status(201).json(questionUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Job_Offer_Questions", error);
  }
};
