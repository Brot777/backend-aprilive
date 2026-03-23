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

    const verificationSaved = await verificationModel.create({ userId, status: "pendiente", images: response });
    await userModel.findByIdAndUpdate(userId, { $set: { verify: "pendiente", } })

    res.status(201).json(verificationSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Verification", error);
  }
};

export const getStatusVerification = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const userFound = await userModel.findById(userId);
    if (!userFound) {
      return res.status(404).json({ error: "404 user not found" });
    }

    res.status(201).json({ status: userFound.verify });
  } catch (error) {
    handleHttp(res, "Error_Get_Status_Verification", error);
  }
}

export const getPendindVerification = async (req: Request, res: Response) => {
  /* paginate */
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);



  try {
    const verifications = await verificationModel
      .find({ status: "pendiente" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "userId",
        select: "_id name photoUrl isCompany",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "images",
        select: "url", // Especifica el campo que deseas recuperar
      })


    let totalDocs = await verificationModel.count({ status: "pendiente" }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: verifications,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Pending_Verification", error);
  }
};

export const getMyVerifications = async (req: Request, res: Response) => {

  const userId = req.userId;

  try {
    const verifications = await verificationModel.find({ userId });
    return res.status(200).json(verifications);
  } catch (error) {
    handleHttp(res, "Error_Get_My_Verification", error);
  }
};


