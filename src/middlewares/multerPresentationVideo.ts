import { Request } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.split("/")[0] === "video") {
    cb(null, true);
  } else {
    cb(new Error("file is not of the correct type"), false);
  }
};

export const uploadPresentationVideo = multer({ storage, fileFilter });
