import { NextFunction, Request, Response } from "express";
import userModel from "../models/user";
import accountTypeModel from "../models/accountType";
export const isCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyUser = await userModel.findOne({
      _id: req.userId,
      isCompany: true,
    });
    if (!companyUser) {
      return res.status(401).json({ error: "only allowed for companies" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const isOwnerAccountCompany = (
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

/* export const isPremiun = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const companyUserId = req.params.companyUserId;
  try {
    const accountType = await accountTypeModel
      .findOne({ userId: req.userId })
      .populate("role");

    if (accountType?.role.name !== companyUserId) {
      return res.status(401).json({ error: "unauthorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
}; */
