import serviceModel from "../models/service";
import mongoose, { LeanDocument, Schema } from "mongoose";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";
import { uploadIdentityDocumentsToS3 } from "../services/identity";

export const createIdentity = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const { response, status } = await uploadIdentityDocumentsToS3(files);
    if (status !== 200) return res.status(status).json(response);
    const { lng, lat, ...restService } = req.body;
    const service = restService;
    service.location = { type: "Point", coordinates: [lng, lat] };
    service.images = response;
    const serviceSaved = await serviceModel.create(service);
    res.status(201).json(serviceSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Service", error);
  }
};
