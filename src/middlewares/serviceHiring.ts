import { NextFunction, Request, Response } from "express";
import { serviceHiringModel } from "../models/serviceHiring";

export const isCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serviceHiringId = req.params.serviceHiringId;
  try {
    const serviceHiring = await serviceHiringModel.findById(serviceHiringId);
    if (!serviceHiring) {
      return res.status(404).json({
        error: "service hiring not found",
      });
    }

    if (req.userId !== serviceHiring.customerId.toString()) {
      return res.status(403).json({ error: "forbidden" });
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
