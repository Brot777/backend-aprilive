import { NextFunction, Request, Response } from "express";
import { disputeModel } from "../models/dispute";

export const verrifyDisputeCreated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerId = req.userId;
  const serviceHiringId = req.params.serviceHiringId;
  try {
    const isTheDisputeCreated = await disputeModel.findOne({
      customerId,
      serviceHiringId,
    });
    if (isTheDisputeCreated) {
      return res.status(403).json({
        error: "a dispute has already been created",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

/* export const verrifyStatusCompleted = async (
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
    if (serviceHiring?.status !== "completado") {
      return res.status(403).json({
        error: "This hiring has not been completed.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

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
 */
