import { Request, Response } from "express";
import {
  loginUser,
  registerNewUser,
  sendEmailResetPassword,
} from "../services/auth";
import { handleHttp } from "../utils/error.handle";
import { userModel } from "../models/user";
import { getTemplateRestartPassword, transporter } from "../config/mail";

export const singup = async ({ body }: Request, res: Response) => {
  try {
    const { response, status } = await registerNewUser(body);
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Something went wrong", error);
  }
};

export const singin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { response, status } = await loginUser({ email, password });
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Something went wrong", error);
  }
};

export const recoverPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const html= getTemplateRestartPassword()
    const { response, status } = await sendEmailResetPassword({
      email,
      transporter,
      "",
      html
    });
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Something went wrong", error);
  }
};
