import { Request, Response } from "express";
import skillModel from "../models/skill";
import userModel from "../models/user";
import personAccountModel from "../models/personAccount";
import { handleHttp } from "../utils/error.handle";
import mongoose from "mongoose";

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await skillModel.find({});
    res.status(200).json(skills);
  } catch (error) {
    handleHttp(res, "Error_Get_Skills", error);
  }
};

export const updateSkills = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const skills = req.body.skills.map(
    (skill: { _id: string; value: string }) => {
      return skill._id;
    }
  );
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid Id" });
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "404 user not found" });
    }
    const userPersonAcconutUpdated = await personAccountModel.findOneAndUpdate(
      { userId },
      { skills },
      {
        new: true,
      }
    );

    res.status(200).json(userPersonAcconutUpdated && req.body.skills);
  } catch (error) {
    handleHttp(res, "Error_Update_Skills", error);
  }
};
