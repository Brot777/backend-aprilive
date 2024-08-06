import { Request, Response } from "express";
import { uploadVideoS3 } from "../services/presentationvideo";

export const createPresentationVideo = async (
  { file, params }: Request,
  res: Response
) => {
  try {
    const { response, status } = await uploadVideoS3(file, params.userId);
    res.status(status).json(response);
  } catch (error) {}
};
