import { NextFunction, Request, Response } from "express";
import userModel from "../models/user";

export const isUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const personUser = await userModel.findOne({
      _id: req.userId,
      isCompany: false,
    });
    if (!personUser) {
      return res.status(401).json({ error: "only allowed for person" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const isOwnerAccountPerson = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const companyUserId = req.params.companyUserId;
  try {
    if (req.userId !== companyUserId) {
      return res.status(401).json({ error: "unauthorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};
