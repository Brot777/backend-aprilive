import jwt from "jsonwebtoken";
import userModel from "../models/user";
import { NextFunction, Request, Response } from "express";
import { Payload } from "../interfaces/payload.interface";

export const isValidToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization || "";
    const token = bearerToken.split(" ").pop();
    if (!token) {
      return res.status(401).json({ error: "no token provided" });
    }
    const payload = jwt.verify(token, process.env.SECRET || "") as Payload;
    req.userId = payload?._id;
  } catch (error) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(401).json({ error: "unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};
