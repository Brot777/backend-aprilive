import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import networkModel from "../models/network";

export const getNetworks = async (req: Request, res: Response) => {
  try {
    const networks = await networkModel.find({});
    res.status(200).json(networks);
  } catch (error) {
    handleHttp(res, "Error_Get_Networks", error);
  }
};
