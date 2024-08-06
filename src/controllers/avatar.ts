import { Request, Response } from "express";
import { uploadPhotoToS3 } from "../services/avatar";

import { handleHttp } from "../utils/error.handle";

export const createAvatar = async (
  { file, params }: Request,
  res: Response
) => {
  try {
    const { response, status } = await uploadPhotoToS3(file, params.userId);
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Error_Upload_Photo", error);
  }
};
