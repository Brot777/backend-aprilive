import { NextFunction, Request, Response } from "express";
import serviceModel from "../models/service";

export const isAuthAccount = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const serviceId = req.params.serviceId;
    try {
        const service=await serviceModel.findById(serviceId)
      if (req.userId !== service?.authorId.toString()) {
        return res.status(401).json({ error: "you can't hire yourself" });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ error: "something went wrong" });
    }
  };