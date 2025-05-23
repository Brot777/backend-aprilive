import { Request, Response } from "express";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import { userModel } from "../models/user";
import personAccountModel from "../models/personAccount";
import workExperienceModel from "./../models/workExperience";

export const createExperienceByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const workExperience = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "No create experience, 404 user not found",
      });
    }
    const workExperiencesSaved = await workExperienceModel.create(
      workExperience
    );
    const personAccountUpdated = await personAccountModel.findOneAndUpdate(
      { userId },
      { $addToSet: { workExperience: workExperiencesSaved._id } },
      { new: true }
    );

    res.status(200).json({ msj: "200" });
  } catch (error) {
    handleHttp(res, "Error_Create_work_Experiences", error);
  }
};

export const updateExperiencesById = async (req: Request, res: Response) => {
  const experienceId = req.params.experienceId;
  try {
    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: "Invalid experience Id" });
    }
    const experience = await workExperienceModel.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: "404 work experience not found" });
    }

    const experienceUpdated = await workExperienceModel.findByIdAndUpdate(
      experienceId,
      req.body,
      { new: true }
    );

    res.status(200).json(experienceUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Work_Experience", error);
  }
};

export const deleteExperiencesById = async (req: Request, res: Response) => {
  const experienceId = req.params.experienceId;
  const userId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: "Invalid experience Id" });
    }
    const experience = await workExperienceModel.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: "404 work experience not found" });
    }

    await workExperienceModel.findByIdAndDelete(experienceId);
    await personAccountModel.findOneAndUpdate(
      { userId },
      { $pull: { workExperience: experienceId } }
    );

    res.status(200).json({ msj: "work Experience successfully deleted" });
  } catch (error) {
    handleHttp(res, "Error_Delete_Work_Experience", error);
  }
};
