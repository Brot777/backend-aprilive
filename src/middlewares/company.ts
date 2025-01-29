import { NextFunction, Request, Response } from "express";
import userModel from "../models/user";
import subscriptionModel from "../models/subscription";
import companyAccountModel from "../models/companyAccount";
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

export const verifyActiveSubcription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const now = new Date();
  try {
    const totalCompanies = await companyAccountModel.count({ ownerId: userId });
    const isActiveSubcription = await subscriptionModel.findOne({
      userId,
      startedAt: { $lte: now },
      finishAt: { $gte: now },
    });
    console.log({ isActiveSubcription, totalCompanies });

    if (totalCompanies == 10) {
      return res.status(402).json({
        error: "No es posible crear mas empress, has alcanzado el limite",
      });
    }

    if (totalCompanies > 0 && totalCompanies < 10 && !isActiveSubcription) {
      return res.status(402).json({
        error: "Necesitas tener una subcripsion activa para crear mas empresas",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};
