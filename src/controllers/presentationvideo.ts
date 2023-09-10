import { Request, Response } from "express";
import { uploadVideoS3 } from "../services/presentationvideo";
import { folders } from "../consts/s3Folders";

export const createPresentationVideo = async (
  { file, params }: Request,
  res: Response
) => {
  try {
    const { response, status } = await uploadVideoS3(
      file,
      folders.presentationVideo,
      params.userId
    );
    console.log(response);
    res.status(status).json(response);
  } catch (error) {}
};
