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
/* 
export const updateCategories = async (req: Request, res: Response) => {
  const serviceId = req.params.serviceId;
  const categories = req.body.categories.map(
    (category: { _id: string; value: string }) => {
      return category._id;
    }
  );
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: "Invalid Id" });
    }
    const service = await serviceModel.findOne({ _id: serviceId });
    if (!service) {
      return res.status(404).json({ error: "404 service not found" });
    }
    const userPersonAcconutUpdated = await personAccountModel.findOneAndUpdate(
      { userId },
      { skills },
      {
        new: true,
      }
    );

    res.status(200).json(userPersonAcconutUpdated && req.body.skills);
  } catch (error) {
    handleHttp(res, "Error_Update_Skills", error);
  }
}; */
