import portfolioModel from "../models/portfolio";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";
import likePortfolioModel from "../models/likePortfolio";
import { folders } from "../consts/s3Folders";
import {
  addPropertiesWhenGetPortfolios,
  addPropertiesWhenGetPortfoliosPersonalized,
  uploadImagesPortfolioToS3,
} from "../services/portfolio";

export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const { response, status } = await uploadImagesPortfolioToS3(
      files,
      folders.imagesOfPortfolio
    );
    if (status !== 200) return res.status(status).json(response);
    const portfolio = req.body;
    portfolio.images = response;
    const portfolioSaved = await portfolioModel.create(portfolio);
    res.status(201).json(portfolioSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Portfolio", error);
  }
};

export const getPersonalizedPortfolios = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);

  try {
    const portfolios = await portfolioModel
      .find()
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
      });

    const newPortfolios = await addPropertiesWhenGetPortfoliosPersonalized(
      portfolios,
      userId
    ); //user with autentication
    let totalDocs = await portfolioModel.count(); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: newPortfolios,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Portfolios", error);
  }
};
export const getPortfolios = async (req: Request, res: Response) => {
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const portfolios = await portfolioModel
      .find()
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
      });
    let totalDocs = await portfolioModel.count(); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    const newPortfolios = await addPropertiesWhenGetPortfolios(portfolios); //unauthenticated user
    return res.status(200).json({
      docs: newPortfolios,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Portfolios", error);
  }
};

export const getPortfolioById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.portfolioId)) {
      return res.status(400).json({ error: "invalid portfolio id" });
    }
    const portfolio = await portfolioModel
      .findById(req.params.portfolioId)
      .populate({
        path: "authorId",
        select: "_id name photoUrl accountType",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "images",
        select: "url", // Especifica el campo que deseas recuperar
      });
    if (!portfolio) {
      return res.status(404).json({ error: "404 portfolio not found" });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    handleHttp(res, "Error_Get_Portfolio", error);
  }
};

export const updatePortfolioById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.portfolioId)) {
      return res.status(400).json({ error: "invalid portfolio id" });
    }
    const portfolio = await portfolioModel.findById(req.params.portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: "404 portfolio not found" });
    }

    const portfolioUpdated = await portfolioModel.findByIdAndUpdate(
      req.params.portfolioId,
      req.body,
      { new: true }
    );

    res.status(200).json(portfolioUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Portfolio", error);
  }
};

export const deletePortfolioById = async (req: Request, res: Response) => {
  const portfolioId = req.params.portfolioId;
  try {
    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      return res.status(400).json({ error: "invalid portfolio id" });
    }
    const portfolio = await portfolioModel.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: "404 portfolio not found" });
    }

    const portfolioDeleted = await portfolioModel.findByIdAndDelete(
      portfolioId
    );
    await likePortfolioModel.deleteMany({ portfolioId });

    res.status(204).json(portfolioDeleted);
  } catch (error) {
    handleHttp(res, "Error_Delete_Portfolio", error);
  }
};

export const likePortfolio = async (req: Request, res: Response) => {
  try {
    const portfolioId = req.params.portfolioId;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      return res.status(400).json({ error: "invalid portfolio id" });
    }
    const portfolio = await portfolioModel.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: "404 portfolio not found" });
    }

    const isLikePortfolio = await likePortfolioModel.findOne({
      userId,
      portfolioId,
    }); // return document likePortfolio or null

    if (isLikePortfolio) {
      await likePortfolioModel.findByIdAndDelete(isLikePortfolio._id);
    } else {
      await likePortfolioModel.create({ userId, portfolioId });
    }
    res.status(201).json({ like: Boolean(!isLikePortfolio) });
  } catch (error) {
    handleHttp(res, "Error_Like_Portfolio", error);
  }
};

export const getPortfoliosByAuthorId = async (req: Request, res: Response) => {
  const authorId = req.params.authorId;
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ error: "invalid author id" });
  }

  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const portfolios = await portfolioModel
      .find({ authorId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("images", "url");

    const totalDocs = await portfolioModel.count({ authorId }); //Possible performance improvement: cache the value
    const totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: portfolios,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Portfolios_By_Author", error);
  }
};
