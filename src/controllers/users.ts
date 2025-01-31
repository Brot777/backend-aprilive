import mongoose from "mongoose";
import userModel from "../models/user";
import personAccountModel from "../models/personAccount";
import avatarModel from "../models/avatar";
import accountTypeModel from "../models/accountType";
import presentationVideoModel from "../models/presentationVideo";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";
import { comparePassword, encryptPassword } from "../utils/bcrypt.handle";

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
      .select("-password")
      .populate("photoUrl", "url")
      .populate("videoUrl", "url")
      .populate("preferences")
      .populate("networks")
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
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "skills",
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
  let { personAccount = {}, password, ...restUser } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user Id" });
    }
    const user = await userModel.findOne({ _id: userId, isCompany: false });

    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }
    await personAccountModel.findOneAndUpdate({ userId }, personAccount);
    const userUpdated = await userModel
      .findByIdAndUpdate(userId, restUser, {
        new: true,
      })
      .select("-password");

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

export const updatePasswordByUserId = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;
  try {
    const userFound = await userModel.findOne({
      _id: userId,
      isCompany: false,
    });
    console.log(userFound);

    if (!userFound) {
      return res.status(404).json({ error: "404 user not found" });
    }
    const matchPassword = await comparePassword(
      oldPassword,
      userFound.password
    );

    if (!matchPassword) {
      return res.status(403).json({ error: "contraseña invalida" });
    }
    const hashPassword = await encryptPassword(newPassword);
    await userModel.findByIdAndUpdate(userId, { password: hashPassword });

    res.status(200).json({ msj: "password updated successfully" });
  } catch (error) {
    handleHttp(res, "Error_Update_Password", error);
  }
};
