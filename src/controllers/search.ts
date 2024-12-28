import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import jobOfferModel from "../models/jobOffer";
import serviceModel from "../models/service";
import portfolioModel from "../models/portfolio";
import { convertTextNormalize } from "../utils/normalizeText";
import userModel from "../models/user";

export const searchJobOffers = async (req: Request, res: Response) => {
  const { typeJob, minSalary, maxSalary, skill } = req.query;
  let query = req.query.filter?.toString() || "";
  query = convertTextNormalize(query);

  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);

  let filters: any = { $text: { $search: query } };
  let proyection: any = { score: { $meta: "textScore" } };
  query == "" && (filters = {});
  query == "" && (proyection = {});

  /* TYPE LOCATION */
  typeJob && (filters.typeJob = typeJob);
  /* SALARY */
  minSalary &&
    maxSalary &&
    (filters.minSalary = { $gte: minSalary, $lte: maxSalary });
  !minSalary && maxSalary && (filters.minSalary = { $lte: maxSalary });
  minSalary && !maxSalary && (filters.minSalary = { $gte: minSalary });
  /* SKILL */
  skill && (filters.skills = skill);
  console.log(filters);

  try {
    const jobOffers = await jobOfferModel
      .find(filters, proyection)
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
      .sort(proyection);

    let totalDocs = await jobOfferModel.count(filters);
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
export const searchUsers = async (req: Request, res: Response) => {
  let query = req.query.filter?.toString() || "";
  query = convertTextNormalize(query);
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const users = await userModel
      .find(
        {
          $text: { $search: query },
        },
        { score: { $meta: "textScore" } }
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .select("username name photoUrl")
      .populate({
        path: "photoUrl",
        select: "url",
      })
      .sort({ score: { $meta: "textScore" } });

    let totalDocs = await userModel.count({
      $text: { $search: query },
    });
    let totalPages = Math.ceil(totalDocs / limit);

    return res.status(200).json({
      docs: users,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Search_Services", error);
  }
};
