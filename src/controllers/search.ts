import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import jobOfferModel from "../models/jobOffer";

export const searchJobOffers = async (req: Request, res: Response) => {
  const query = req.query.filter?.toString() || "";
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const jobOffers = await jobOfferModel
      .find(
        {
          $text: { $search: query },
        },
        { score: { $meta: "textScore" } }
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ score: { $meta: "textScore" } });

    let totalDocs = await jobOfferModel.count({
      $text: { $search: query },
    });
    let totalPages = Math.ceil(totalDocs / limit);

    return res.status(200).json({
      docs: jobOffers,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Search_Job", error);
  }
};
