import jwt from "jsonwebtoken";

import { userModel } from "../models/user";

import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { getTemplateRestartPassword } from "../utils/getTemplateEmail";

export const sendEmailVerifyEmail = async (
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
