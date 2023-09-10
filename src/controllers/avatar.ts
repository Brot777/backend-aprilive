import { Request, Response } from "express";
import { uploadPhotoToS3 } from "../services/avatar";
import { folders } from "../consts/s3Folders";
import { handleHttp } from "../utils/error.handle";

export const createAvatar = async (
  { file, params }: Request,
  res: Response
) => {
  try {
    const { response, status } = await uploadPhotoToS3(
      file,
      folders.avatars,
      params.userId
    );
    console.log(response);
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Error_Upload_Photo", error);
  }
};
