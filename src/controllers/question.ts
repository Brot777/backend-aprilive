import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import jobOfferQuestionModel from "../models/jobOfferQuestion";

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
