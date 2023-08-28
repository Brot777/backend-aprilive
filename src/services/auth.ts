import { LoginUser, RegisterUser } from "../interfaces/user.interface";
import userModel from "../models/user";
import jwt from "jsonwebtoken";
import { comparePassword, encryptPassword } from "../utils/bcrypt.handle";

export const registerNewUser = async (user: RegisterUser) => {
  user.password = await encryptPassword(user.password);
  const userSaved = await userModel.create(user);
  const token = jwt.sign({ _id: userSaved._id }, process.env.SECRET || "");
  return {
    response: { _id: userSaved._id, username: userSaved.username, token },
    status: 200,
  };
};

export const loginUser = async ({ username, password }: LoginUser) => {
  const userFound = await userModel.findOne({ username });
  if (!userFound) {
    return {
      response: { error: "Usuario o contraseña invalido" },
      status: 401,
    };
  }
  const matchPassword = await comparePassword(password, userFound.password);

  if (!matchPassword) {
    return {
      response: { error: "Usuario o contraseña invalido" },
      status: 401,
    };
  }

  const token = jwt.sign({ _id: userFound._id }, process.env.SECRET || "");
  return {
    response: { _id: userFound._id, username: userFound.username, token },
    status: 200,
  };
};
