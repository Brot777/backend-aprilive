import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { comparePassword, encryptPassword } from "../utils/bcrypt.handle";
import { LoginUser, RegisterUser } from "../interfaces/user.interface";
import { userModel } from "../models/user";
import avatarModel from "../models/avatar";
import presentationVideoModel from "../models/presentationVideo";
import personAccountModel from "../models/personAccount";
import roleModel from "../models/role";
import accountTypeModel from "../models/accountType";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { getTemplateRestartPassword } from "../config/mail";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config/OAuth2";

export const registerNewUser = async (user: RegisterUser) => {
  user.password = await encryptPassword(user.password);
  const userSaved = await userModel.create(user);

  const personAccountSaved = await personAccountModel.create({
    userId: userSaved._id,
  });
  const avatarSaved = await avatarModel.create({
    userId: userSaved._id,
  });
  const presentationVideoSaved = await presentationVideoModel.create({
    userId: userSaved._id,
  });

  const freeUserRole = await roleModel.findOne({
    name: "Free User",
  });

  const accountTypeSaved = await accountTypeModel.create({
    userId: userSaved._id,
    role: freeUserRole?._id,
  });

  await userModel.findByIdAndUpdate(
    userSaved._id,
    {
      photoUrl: avatarSaved._id,
      videoUrl: presentationVideoSaved._id,
      personAccount: personAccountSaved._id,
      accountType: accountTypeSaved._id,
    },
    {
      new: true,
    }
  );

  const token = jwt.sign({ _id: userSaved._id }, process.env.SECRET || "");
  return {
    response: {
      _id: userSaved._id,
      username: userSaved.username,
      token,
      isCompany: false,
    },
    status: 200,
  };
};

export const loginUser = async ({ email, password }: LoginUser) => {
  const userFound = await userModel.findOne({
    "email.value": email,
    isCompany: false,
  });
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
    response: {
      _id: userFound._id,
      username: userFound.username,
      token,
      isCompany: false,
    },
    status: 200,
  };
};

export const sendEmailResetPassword = async (
  email: string,
  transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >,
  subject: string
) => {
  const userFound = await userModel.findOne({
    "email.value": email,
    isCompany: false,
  });

  if (!userFound) {
    return {
      response: { error: "Correo electronico no registrado" },
      status: 401,
    };
  }
  const token = jwt.sign({ _id: userFound._id }, process.env.SECRET || "", {
    expiresIn: 10 * 60,
  });
  const html = getTemplateRestartPassword(userFound?.name, token);
  const emailSender = process.env.SMTP_EMAIL;
  const info = await transporter.sendMail({
    from: `APRILIVE <${emailSender}>`,
    to: email,
    subject,
    text: "Aprilive",
    html, // HTML body
  });
  console.log(info);

  return {
    response: { message: "Correo de Verificación enviado correctamente" },
    status: 200,
  };
};

export const authorizationWithGoogle = async (idToken: string) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    return {
      message: "token google invalido",
      status: 401,
    };
  }
  console.log(payload);

  const { sub, email, name, picture } = payload;

  // Buscar usuario en tu base de datos o crearlo
  const personAccountFound = await personAccountModel.findOne({
    "oauth2.googleId": sub,
  });
  const userFound = await userModel.findById(personAccountFound?.userId);

  if (userFound) {
    const token = jwt.sign({ _id: userFound._id }, process.env.SECRET || "");
    return {
      response: {
        _id: userFound._id,
        username: userFound.username,
        token,
        isCompany: false,
      },
      status: 200,
    };
  }

  const userSaved = await userModel.create({
    email: { value: email },
    name,
    username: `${name}_${uuidv4()}`,
    googleId: sub,
    avatar: picture,
  });

  const personAccountSaved = await personAccountModel.create({
    userId: userSaved._id,
  });
  const avatarSaved = await avatarModel.create({
    userId: userSaved._id,
  });
  const presentationVideoSaved = await presentationVideoModel.create({
    userId: userSaved._id,
  });

  const freeUserRole = await roleModel.findOne({
    name: "Free User",
  });

  const accountTypeSaved = await accountTypeModel.create({
    userId: userSaved._id,
    role: freeUserRole?._id,
  });

  await userModel.findByIdAndUpdate(
    userSaved._id,
    {
      photoUrl: avatarSaved._id,
      videoUrl: presentationVideoSaved._id,
      personAccount: personAccountSaved._id,
      accountType: accountTypeSaved._id,
    },
    {
      new: true,
    }
  );

  const token = jwt.sign({ _id: userSaved._id }, process.env.SECRET || "");
  return {
    response: {
      _id: userSaved._id,
      username: userSaved.username,
      token,
      isCompany: false,
    },
    status: 200,
  };
};
