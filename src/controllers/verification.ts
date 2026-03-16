import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";
import { uploadVerificationDocumentsToS3 } from "../services/verification";
import { verificationModel } from "../models/verification";
import { userModel } from "../models/user";

export const createVerification = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const { response, status } = await uploadVerificationDocumentsToS3(files, userId);
    if (status !== 200) return res.status(status).json(response);

    const verificationSaved=await verificationModel.create({ userId,status:"pendiente", images: response });
    await userModel.findByIdAndUpdate(userId,{$set:{verify: "pendiente",}})
    
    res.status(201).json(verificationSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Service", error);
  }
};

export const getStatusVerification=async(req:Request,res:Response)=>{
  const userId = req.userId;
  try {
    const userFound=await userModel.findById(userId);
    if (!userFound) {
      return res.status(404).json({ error: "404 user not found" });
    }
    
    res.status(201).json({status:userFound.verify});
  } catch (error) {
    handleHttp(res, "Error_Create_Service", error);
  }
}