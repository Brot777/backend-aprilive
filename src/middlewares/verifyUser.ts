import { NextFunction, Request, Response } from "express";
import userModel from "../models/user";

export const checkDuplicateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (user) {
      return res
        .status(401)
        .json({ error: "Este nombre de usuario ya existe" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};
export const checkDuplicateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
      isCompany: false,
    });
    if (user) {
      return res
        .status(401)
        .json({ error: "Este correo electronico ya esta en uso" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};
