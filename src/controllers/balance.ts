import { Request, Response } from "express";

import { handleHttp } from "../utils/error.handle";
import serviceHiringModel from "../models/serviceHiring";
import mongoose, { Types, ObjectId } from "mongoose";

export const getMyBalance = async (req: Request, res: Response) => {
  const authorId = req.userId;
  try {
    const serviceHirings = await serviceHiringModel.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" }, // Asegurar que cada pago tenga un servicio relacionado
      { $match: { "service.authorId": new mongoose.Types.ObjectId(authorId) } }, // Filtrar por el autor
    ]);
    console.log(serviceHirings);

    res.status(200).json(serviceHirings);
  } catch (error) {
    handleHttp(res, "Error_Upload_Photo", error);
  }
};
