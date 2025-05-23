import { Request, Response } from "express";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import { userModel } from "../models/user";
import personAccountModel from "../models/personAccount";
import userLanguajeModel from "./../models/userLanguaje";
import languajeModel from "./../models/languaje";

export const getAllLanguajes = async (req: Request, res: Response) => {
  try {
    const languajes = await languajeModel.find({});
    res.status(200).json(languajes);
  } catch (error) {
    handleHttp(res, "Error_Get_Languajes", error);
  }
};

export const createUserLanguajeByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId;
    const userLanguaje = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "404, user not found",
      });
    }
    const userLanguajeSaved = await userLanguajeModel.create(userLanguaje);

    const personAccountUpdated = await personAccountModel.findOneAndUpdate(
      { userId },
      { $addToSet: { languages: userLanguajeSaved._id } },
      { new: true }
    );

    res.status(200).json({ msj: "200" });
  } catch (error) {
    handleHttp(res, "Error_Create_User_Languaje", error);
  }
};

export const updateUserLanguajenById = async (req: Request, res: Response) => {
  const userLanguajeId = req.params.userLanguajeId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userLanguajeId)) {
      return res.status(400).json({ error: "Invalid user languaje Id" });
    }
    const userLanguaje = await userLanguajeModel.findById(userLanguajeId);
    if (!userLanguaje) {
      return res
        .status(404)
        .json({ error: "404 user user languaje not found" });
    }

    const userLanguajeUpdated = await userLanguajeModel.findByIdAndUpdate(
      userLanguajeId,
      req.body,
      { new: true }
    );

    res.status(200).json(userLanguajeUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_User_Languaje", error);
  }
};

export const deleteUserLanguajeById = async (req: Request, res: Response) => {
  const userLanguajeId = req.params.userLanguajeId;
  const userId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userLanguajeId)) {
      return res.status(400).json({ error: "Invalid user languaje Id" });
    }
    const userLanguaje = await userLanguajeModel.findById(userLanguajeId);
    if (!userLanguaje) {
      return res.status(404).json({ error: "404 user languaje not found" });
    }

    await userLanguajeModel.findByIdAndDelete(userLanguajeId);
    await personAccountModel.findOneAndUpdate(
      { userId },
      { $pull: { languages: userLanguajeId } }
    );

    res.status(200).json({ msj: "user languaje successfully deleted" });
  } catch (error) {
    handleHttp(res, "Error_Delete_User_Languaje", error);
  }
};
