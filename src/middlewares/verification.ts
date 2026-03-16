import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user";

export const isStatusAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId=req.userId;
  
  try {
    const userFound=await userModel.findById(userId);
    if (userFound?.verify === "pendiente" ) {
      return res.status(401).json({ error: "ya existe un proceso de verificacion pendiente" });
    }

    if (userFound?.verify=== "verificado") {
      return res.status(401).json({ error: "este usuario ya ha sido verificado" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

