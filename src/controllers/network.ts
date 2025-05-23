import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import networkModel from "../models/network";
import { userModel } from "../models/user";
import userNetworkModel from "../models/userNetwork";
import mongoose from "mongoose";

export const getAllNetworks = async (req: Request, res: Response) => {
  try {
    const networks = await networkModel.find({});
    res.status(200).json(networks);
  } catch (error) {
    handleHttp(res, "Error_Get_Networks", error);
  }
};

export const createUserNetworkByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId;
    const userNetwork = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "404, user not found",
      });
    }
    const userNetworkSaved = await userNetworkModel.create(userNetwork);
    const userNetworkFind = await userNetworkModel
      .findById(userNetworkSaved._id)
      .populate("network");

    const personAccountUpdated = await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { networks: userNetworkSaved._id } },
      { new: true }
    );

    res.status(200).json({ userNetworkFind });
  } catch (error) {
    handleHttp(res, "Error_Create_User_Network", error);
  }
};

export const updateUserNetworkById = async (req: Request, res: Response) => {
  const userNetworkId = req.params.userNetworkId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userNetworkId)) {
      return res.status(400).json({ error: "Invalid user network Id" });
    }
    const userNetwork = await userNetworkModel.findById(userNetworkId);
    if (!userNetwork) {
      return res
        .status(404)
        .json({ error: "404 user user languaje not found" });
    }

    const userNetworkUpdated = await userNetworkModel.findByIdAndUpdate(
      userNetworkId,
      req.body,
      { new: true }
    );

    res.status(200).json(userNetworkUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_User_Languaje", error);
  }
};

export const deleteuserNetworkById = async (req: Request, res: Response) => {
  const userNetworkId = req.params.userNetworkId;
  const userId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userNetworkId)) {
      return res.status(400).json({ error: "Invalid user network Id" });
    }
    const userNetwork = await userNetworkModel.findById(userNetworkId);
    if (!userNetwork) {
      return res.status(404).json({ error: "404 user network not found" });
    }

    await userNetworkModel.findByIdAndDelete(userNetworkId);
    await userModel.findByIdAndUpdate(userId, {
      $pull: { networks: userNetworkId },
    });

    res.status(200).json({ msj: "user network successfully deleted" });
  } catch (error) {
    handleHttp(res, "Error_Delete_User_Network", error);
  }
};
