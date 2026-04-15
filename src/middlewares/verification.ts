import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user";
import { verificationModel } from "../models/verification";
import { USER_EMAIL_ALLOWED, USER_ID_ALLOWED } from "../config/userAllowed";

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
    return res.status(500).json({ error: "something went wrong" });
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
      console.log(userId+"1");
      
     return res.status(404).json({error: "user not found"})
    }

   if (userFound?._id.toString()!==USER_ID_ALLOWED?.toString() || userFound?.email.value.toString()!==USER_EMAIL_ALLOWED?.toString()) {
   console.log({_id:userFound._id,USER_ID_ALLOWED,email:userFound.email.value,USER_EMAIL_ALLOWED});
   
    console.log(userId+"2");
     return res.status(401).json({error: "Unautorized"})
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};

