import mongoose from "mongoose";
import userModel from "../models/user";
import personAccountModel from "../models/personAccount";
import avatarModel from "../models/avatar";
import accountTypeModel from "../models/accountType";
import presentationVideoModel from "../models/presentationVideo";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel
      .find({ isCompany: false })
      .select("-password");
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
        path: "accountType",
        select: "role",
        populate: {
          path: "role",
          select: "name -_id",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "cv",
          select: "url",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "workExperience",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "education",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "languages",
          populate: {
            path: "languaje",
          },
        },
      });
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }

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
