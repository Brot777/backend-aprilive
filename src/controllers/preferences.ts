import { Request, Response } from "express";
import preferenceModel from "../models/preference";
import userModel from "../models/user";
import { handleHttp } from "../utils/error.handle";
import mongoose from "mongoose";

export const getPreferences = async (req: Request, res: Response) => {
  try {
    const preferences = await preferenceModel.find({});
    res.status(200).json(preferences);
  } catch (error) {
    handleHttp(res, "Error_Get_Preferences", error);
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const preferences = req.body.preferences.map(
    (preference: { _id: string; value: string }) => {
      return preference._id;
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
    const userUpdated = await userModel.findByIdAndUpdate(
      userId,
      { preferences },
      {
        new: true,
      }
    );

    res.status(200).json(userUpdated && req.body.preferences);
  } catch (error) {
    handleHttp(res, "Error_Update_Preferences", error);
  }
};
