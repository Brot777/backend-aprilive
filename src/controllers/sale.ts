import { Request, Response } from "express";

import { handleHttp } from "../utils/error.handle";
import { serviceHiringModel } from "../models/serviceHiring";
import mongoose, { Types, ObjectId } from "mongoose";

export const getMyBalance = async (req: Request, res: Response) => {
  const authorId = req.userId;
  try {
    const arrayTotalBalance = await serviceHiringModel.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" }, // Asegurar que cada pago tenga un servicio relacionado
      {
        $match: {
          "service.authorId": new mongoose.Types.ObjectId(authorId),
          status: "completado",
        },
      }, // Filtrar por el autor
      {
        $addFields: {
          numTotalAmount: { $toDouble: "$totalAmount" }, // Convierte el monto a número
        },
      },
      {
        $group: {
          _id: null, // Usamos `null` si queremos una suma total; puedes cambiarlo para agrupar por otro criterio
          totalBalance: { $sum: "$numTotalAmount" }, // Sumar los montos
        },
      },
    ]);

    res.status(200).json({
      totalBalance: arrayTotalBalance[0]?.totalBalance || 0,
      currency: "USD",
    });
  } catch (error) {
    handleHttp(res, "Error_Upload_Photo", error);
  }
};

export const getMySales = async (req: Request, res: Response) => {
  const serviceProviderId = req.userId;
  try {
    const serviceHirings = await serviceHiringModel
      .find({ serviceProviderId })
      .populate({ path: "reviewId", select: "value" })
      .populate({
        path: "serviceId",
        select: "authorId title",
        populate: {
          path: "authorId",
          select: "_id name photoUrl",
          populate: {
            path: "photoUrl",
            select: "url",
          },
        },
      });

    return res.status(200).json(serviceHirings);
  } catch (error) {
    handleHttp(res, "Error_Get_Service_Hirings", error);
  }
};
