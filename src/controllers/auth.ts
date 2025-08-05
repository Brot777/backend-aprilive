import { Request, Response } from "express";
import { loginUser, registerNewUser } from "../services/auth";
import { handleHttp } from "../utils/error.handle";

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
  /* try {
    const { email } = req.body;
    const { response, status } = await loginUser({ email, });
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Something went wrong", error);
  } */
};
