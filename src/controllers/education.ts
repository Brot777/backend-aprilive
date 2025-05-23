import { Request, Response } from "express";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import { userModel } from "../models/user";
import personAccountModel from "../models/personAccount";
import educationModel from "./../models/education";

export const createEducationByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const education = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "No create education, user not found",
      });
    }
    const educationSaved = await educationModel.create(education);
    const personAccountUpdated = await personAccountModel.findOneAndUpdate(
      { userId },
      { $addToSet: { education: educationSaved._id } },
      { new: true }
    );

    res.status(200).json({ msj: "200" });
  } catch (error) {
    handleHttp(res, "Error_Create_Education", error);
  }
};

export const updateEducationById = async (req: Request, res: Response) => {
  const educationId = req.params.educationId;
  try {
    if (!mongoose.Types.ObjectId.isValid(educationId)) {
      return res.status(400).json({ error: "Invalid education Id" });
    }
    const education = await educationModel.findById(educationId);
    if (!education) {
      return res.status(404).json({ error: "404 education not found" });
    }

    const educationUpdated = await educationModel.findByIdAndUpdate(
      educationId,
      req.body,
      { new: true }
    );

    res.status(200).json(educationUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Education", error);
  }
};

export const deleteEduacationById = async (req: Request, res: Response) => {
  const educationId = req.params.educationId;
  const userId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(educationId)) {
      return res.status(400).json({ error: "Invalid education Id" });
    }
    const education = await educationModel.findById(educationId);
    if (!education) {
      return res.status(404).json({ error: "404 education not found" });
    }

    await educationModel.findByIdAndDelete(educationId);
    await personAccountModel.findOneAndUpdate(
      { userId },
      { $pull: { education: educationId } }
    );

    res.status(200).json({ msj: "education successfully deleted" });
  } catch (error) {
    handleHttp(res, "Error_Delete_Education", error);
  }
};
