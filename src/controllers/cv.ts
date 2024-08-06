import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { uploadCvToS3 } from "../services/cv";
import cvModel from "../models/cv";

export const createCv = async ({ file, params }: Request, res: Response) => {
  try {
    const { response, status } = await uploadCvToS3(file, params.userId);
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Error_Upload_Cv", error);
  }
};
export const getCv = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const cv = cvModel.findOne({ userId });
    res.status(200).json(cv);
  } catch (error) {
    handleHttp(res, "Error_Get_Cv", error);
  }
};
