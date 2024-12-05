import { Request, Response } from "express";

import { handleHttp } from "../utils/error.handle";
import serviceHiringModel from "../models/serviceHiring";
import mongoose, { Types, ObjectId } from "mongoose";
import serviceModel from "../models/service";
import { Service } from "../interfaces/service";

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
          status: "COMPLETED",
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

    res
      .status(200)
      .json({ totalBalance: arrayTotalBalance[0]?.totalBalance || 0 });
  } catch (error) {
    handleHttp(res, "Error_Upload_Photo", error);
  }
};
export const getSales = async (req: Request, res: Response) => {
  const authorId = req.params.authorId;

  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ error: "invalid author id" });
  }

  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const services: Service[] = await serviceModel
      .find({ authorId })
      .select("_id");
    const servoceIds = services.map((service: Service) => service._id);

    const serviceHirings = await serviceHiringModel
      .find({ authorId })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("categories authorId images price money title description")
      .populate("categories")
      .populate({
        path: "authorId",
        select: "_id name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "images",
        select: "url", // Especifica el campo que deseas recuperar
      });

    const totalDocs = await serviceModel.count({ authorId }); //Possible performance improvement: cache the value
    const totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: services,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Services_By_Author", error);
  }
};
