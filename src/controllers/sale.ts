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
  const authorId = req.userId;
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: "invalid user id" });
    }

    const sales = await serviceHiringModel.aggregate([
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
        $project: {
          _id: 1,
          paymentId: 1,
          status: 1,
          totalAmount: 1,
          netAmount: 1,
          createdAt: 1,
        },
      },
      {
        $facet: {
          metadata: [
            { $count: "total" }, // Conteo total de documentos
          ],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ]);

    const totalDocs = sales[0].metadata[0]?.total || 0; //Possible performance improvement: cache the value
    const totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: sales[0].data,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_My_Sales", error);
  }
};
