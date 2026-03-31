import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user";
import { verificationModel } from "../models/verification";
import { USER_ID_ALLOWED } from "../config/userAllowed";

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

export const isInAllowedRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId=req.userId;
  
  try {
    const numberOfVerifications= await verificationModel.count({userId})
    if (numberOfVerifications >= 5 ) {
      return res.status(401).json({ error: "se alcanzo el numero maximo de intentos permitidos" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const isAccontAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId=req.userId;
  
  try {
    const userFound=  await userModel.findById(userId)
    if (!userFound) {
      res.status(404).json({error: "user not found"})
    }

    if (!(userFound?._id===USER_ID_ALLOWED) ) {
      return res.status(401).json({ error: "unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

