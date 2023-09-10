import mongoose from "mongoose";
import userModel from "../models/user";
import followerModel from "../models/follower";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    handleHttp(res, "Error_Get_Users", error);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ error: "404 not found" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }

    const [numberFollowers, numberFollowing] = await Promise.all([
      followerModel.count({ userId }),
      followerModel.count({ followerId: userId }),
    ]);

    user.numberFollowers = numberFollowers;
    user.numberFollowing = numberFollowing;
    console.log(user);

    res.status(200).json(user);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid Id" });
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }
    const userUpdated = await userModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.status(200).json(userUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_User", error);
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  console.log(req.params.userId);
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ error: "404 not found" });
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }
    const response = await userModel.findByIdAndDelete(userId);
    res.status(200).json(response);
  } catch (error) {
    handleHttp(res, "Error_Delete_User", error);
  }
};
