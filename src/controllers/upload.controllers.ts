import { Request, Response } from "express";
import { uploadPhotoToS3 } from "../utils/upload.s3";

export const uploadPhoto = (req: Request, res: Response) => {
  console.log(req.files);
  console.log(uploadPhotoToS3);
  let onlyFile = req.files ? req.files["photo"] : null;
  if (!onlyFile) {
    return res.status(400).json({ error: "no file provided" });
  }
  /*   uploadPhotoToS3(onlyFile); */
  res.status(200).json(req.files);
};
