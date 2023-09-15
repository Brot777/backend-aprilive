import { LoginUser, RegisterUser } from "../interfaces/user.interface";
import userModel from "../models/user";
import avatarModel from "../models/avatar";
import presentationVideoModel from "../models/presentationVideo";
import jwt from "jsonwebtoken";
import { comparePassword, encryptPassword } from "../utils/bcrypt.handle";

export const registerNewUser = async (user: RegisterUser) => {
  user.password = await encryptPassword(user.password);
  const userSaved = await userModel.create(user);
  const avatarSaved = await avatarModel.create({
    userid: userSaved._id,
  });
  const presentationVideoSaved = await presentationVideoModel.create({
    userid: userSaved._id,
  });

  await userModel.findByIdAndUpdate(
    userSaved._id,
    { photoUrl: avatarSaved._id, videoUrl: presentationVideoSaved._id },
    {
      new: true,
    }
  );

  const token = jwt.sign({ _id: userSaved._id }, process.env.SECRET || "");
  return {
    response: { _id: userSaved._id, username: userSaved.username, token },
    status: 200,
  };
};

export const loginUser = async ({ email, password }: LoginUser) => {
  const userFound = await userModel.findOne({ email });
  if (!userFound) {
    return {
      response: { error: "correo electronico o contraseña invalido" },
      status: 401,
    };
  }
  const matchPassword = await comparePassword(password, userFound.password);

  if (!matchPassword) {
    return {
      response: { error: "correo electronico o contraseña invalido" },
      status: 401,
    };
  }

  const token = jwt.sign({ _id: userFound._id }, process.env.SECRET || "");
  return {
    response: { _id: userFound._id, username: userFound.username, token },
    status: 200,
  };
};
