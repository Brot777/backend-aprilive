import { handleHttp } from "../utils/error.handle.js";
import userModel from "./../models/user.model.js";
import jwt from "jsonwebtoken";

export const singup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const newUser = new userModel({
      firstName,
      lastName,
      username,
      email,
      password: await userModel.encryptPassword(password),
    });
    const userSaved = await newUser.save();

    const token = jwt.sign({ _id: userSaved._id }, process.env.SECRET);

    res
      .status(200)
      .json({ _id: userSaved._id, username: userSaved.username, token });
  } catch (error) {
    handleHttp(res, "Something went wrong", error);
  }
};

export const singin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userFound = await userModel.findOne({ username });
    if (!userFound) {
      return res.status(401).json({ error: "Usuario o contraseña invalido" });
    }

    const matchPassword = await userModel.comparePassword(
      password,
      userFound.password
    );

    if (!matchPassword) {
      return res.status(400).json({ error: "Usuario o contraseña invalido" });
    }

    const token = jwt.sign({ _id: userFound._id }, process.env.SECRET);
    res
      .status(200)
      .json({ _id: userFound._id, username: userFound.username, token });
  } catch (error) {
    handleHttp(res, "Something went wrong", error);
  }
};
