import mongoose from "mongoose";
import userModel from "../models/user";
import followerModel from "../models/follower";
import personAccountModel from "../models/personAccount";
import avatarModel from "../models/avatar";
import accountTypeModel from "../models/accountType";
import presentationVideoModel from "../models/presentationVideo";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find({ isCompany: false });
    res.status(200).json(users);
  } catch (error) {
    handleHttp(res, "Error_Get_Users", error);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "invalid user id" });
    }
    const user = await userModel
      .findById(userId)
      .populate("photoUrl", "url")
      .populate("videoUrl", "url")
      .populate("preferences")
      .populate({
        path: "personAccount",
        populate: {
          path: "myCompanies",
          select: "name email photoUrl",
          populate: {
            path: "photoUrl",
            select: "-_id url",
          },
        },
      })
      .populate({
        path: "accountType",
        select: "role",
        populate: {
          path: "role",
          select: "name -_id",
        },
      });
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }

    const [numberFollowers, numberFollowing] = await Promise.all([
      followerModel.count({ userId }),
      followerModel.count({ followerId: userId }),
    ]);

    user.numberFollowers = numberFollowers;
    user.numberFollowing = numberFollowing;

    res.status(200).json(user);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  let { personAccount = {}, ...restUser } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user Id" });
    }
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }
    await personAccountModel.findOneAndUpdate({ userId }, personAccount);
    const userUpdated = await userModel
      .findByIdAndUpdate(userId, restUser, {
        new: true,
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "myCompanies",
        },
      });
    res.status(200).json(userUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_User", error);
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
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

    await personAccountModel.deleteOne({ userId });
    await avatarModel.deleteOne({ userId });
    await presentationVideoModel.deleteOne({ userId });
    await accountTypeModel.deleteOne({ userId });
    res.status(200).json(response);
  } catch (error) {
    handleHttp(res, "Error_Delete_User", error);
  }
};

export const followUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const followerId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid Id" });
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "404 user not found" });
    }
    const isFollower = await followerModel.findOne({ userId, followerId }); //return document Follower or null
    if (isFollower) {
      await followerModel.findByIdAndDelete(isFollower._id);
    } else {
      await followerModel.create({ userId, followerId });
    }
    res.status(204).json();
  } catch (error) {
    handleHttp(res, "Error_Following_User", error);
  }
};
