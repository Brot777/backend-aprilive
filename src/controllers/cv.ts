import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { updateCvInS3, uploadCvToS3 } from "../services/cv";
import cvModel from "../models/cv";

export const getMyCv = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const cv = await cvModel.findOne({ userId });

    res.status(200).json(cv);
  } catch (error) {
    handleHttp(res, "Error_Get_Cv", error);
  }
};

export const createCv = async ({ file, userId }: Request, res: Response) => {
  try {
    const { response, status } = await uploadCvToS3(file, userId);
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Error_Upload_Cv", error);
  }
};

export const updateCv = async ({ file, userId }: Request, res: Response) => {
  try {
    const { response, status } = await updateCvInS3(file, userId);
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Error_Upload_Cv", error);
  }
};
