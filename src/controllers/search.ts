import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import jobOfferModel from "../models/jobOffer";
import serviceModel from "../models/service";
import portfolioModel from "../models/portfolio";
import { convertTextNormalize } from "../utils/normalizeText";

export const searchJobOffers = async (req: Request, res: Response) => {
  let query = req.query.filter?.toString() || "";
  query = convertTextNormalize(query);
  console.log(query);

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
      .populate({
        path: "authorId",
        select: "photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "authorId",
        select: "name isCompany accountType",
        populate: {
          path: "accountType",
          select: "role",
          populate: {
            path: "role",
            select: "name",
          },
        },
      })
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
    handleHttp(res, "Error_Search_Job_Offers", error);
  }
};

export const searchServices = async (req: Request, res: Response) => {
  let query = req.query.filter?.toString() || "";
  query = convertTextNormalize(query);
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const services = await serviceModel
      .find(
        {
          $text: { $search: query },
        },
        { score: { $meta: "textScore" } }
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "authorId",
        select: "photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "authorId",
        select: "name isCompany accountType",
        populate: {
          path: "accountType",
          select: "role",
          populate: {
            path: "role",
            select: "name",
          },
        },
      })
      .populate({
        path: "images",
        select: "-_id url", // Especifica el campo que deseas recuperar
      })
      .sort({ score: { $meta: "textScore" } });

    let totalDocs = await serviceModel.count({
      $text: { $search: query },
    });
    let totalPages = Math.ceil(totalDocs / limit);

    return res.status(200).json({
      docs: services,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Search_Services", error);
  }
};

export const searchPortfolios = async (req: Request, res: Response) => {
  let query = req.query.filter?.toString() || "";
  query = convertTextNormalize(query);
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const jobOffers = await portfolioModel
      .find(
        {
          $text: { $search: query },
        },
        { score: { $meta: "textScore" } }
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "authorId",
        select: "photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "authorId",
        select: "name isCompany accountType",
        populate: {
          path: "accountType",
          select: "role",
          populate: {
            path: "role",
            select: "name",
          },
        },
      })
      .populate({
        path: "images",
        select: "-_id url", // Especifica el campo que deseas recuperar
      })
      .sort({ score: { $meta: "textScore" } });

    let totalDocs = await portfolioModel.count({
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
    handleHttp(res, "Error_Search_Portfolio", error);
  }
};
