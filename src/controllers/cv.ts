import { Request, Response } from "express";
import { folders } from "../consts/s3Folders";
import { handleHttp } from "../utils/error.handle";
import { uploadCvToS3 } from "../services/cv";

export const createCv = async ({ file, params }: Request, res: Response) => {
  try {
    const { response, status } = await uploadCvToS3(
      file,
      folders.cv,
      params.userId
    );
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Error_Upload_Cv", error);
  }
};
