import { Request, Response } from "express";
import skillModel from "../models/skill";
import userModel from "../models/user";
import personAccountModel from "../models/personAccount";
import { handleHttp } from "../utils/error.handle";
import mongoose from "mongoose";

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await skillModel.find({});
    res.status(200).json(skills);
  } catch (error) {
    handleHttp(res, "Error_Get_Skills", error);
  }
};
