import { Request, Response } from "express";
import categoryModel from "../models/category";

import { handleHttp } from "../utils/error.handle";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).json(categories);
  } catch (error) {
    handleHttp(res, "Error_Get_Categories", error);
  }
};
