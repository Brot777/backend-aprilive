import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceHiringModel from "../models/serviceHiring";

export const getMyServiceHiring = async (req: Request, res: Response) => {
  const customerId = req.userId;
  try {
    const serviceHirings = await serviceHiringModel
      .find({ customerId })
      .populate("reviewId")
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
