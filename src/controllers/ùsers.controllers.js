import mongoose from "mongoose";
import userModel from "./../models/user.model.js";
import { handleHttp } from "../utils/error.handle.js";

/* export const createUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const newUser = new userModel({
      name,
      username,
      password: await userModel.encryptPassword(password),
    });
    const userSaved = await newUser.save();
    res.status(201).json(userSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_User", error);
  }
}; */

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    handleHttp(res, "Error_Get_Users", error);
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ error: "404 not found" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};

export const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ error: "404 not found" });
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

export const deleteUserById = async (req, res) => {
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
