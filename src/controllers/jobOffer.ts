import jobOfferModel from "../models/jobOffer";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";
import {
  addPropertiesWhenGetJobOffer,
  addPropertiesWhenGetJobOfferPersonalized,
  convertTitleNormalize,
} from "../services/jobOffer";
import likeJobOfferModel from "../models/likeJobOffer";
import favoriteJobOfferModel from "../models/favoriteJobOffer";
import commentJobOfferModel from "../models/commentJobOffer";

export const createJobOffer = async (req: Request, res: Response) => {
  try {
    const jobOffer = req.body;
    jobOffer.jobTitleNormalize = convertTitleNormalize(jobOffer.jobTitle);
    const jobOfferSaved = await jobOfferModel.create(jobOffer);
    res.status(201).json(jobOfferSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Job_Offer", error);
  }
};

export const getPersonalizedJobOffers = async (req: Request, res: Response) => {
  const userId = req.userId;
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);

  try {
    const jobOffers = await jobOfferModel
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
      });

    const newJobOffers = await addPropertiesWhenGetJobOfferPersonalized(
      jobOffers,
      userId
    ); //user with autentication
    let totalDocs = await jobOfferModel.count(); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: newJobOffers,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Job_Offers", error);
  }
};
export const getJobOffers = async (req: Request, res: Response) => {
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const jobOffers = await jobOfferModel
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
      });
    let totalDocs = await jobOfferModel.count(); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    const newJobOffers = await addPropertiesWhenGetJobOffer(jobOffers); //unauthenticated user
    return res.status(200).json({
      docs: newJobOffers,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Job_Offers", error);
  }
};

export const getJobOfferById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.jobOfferId)) {
      return res.status(400).json({ error: "invalid job offer id" });
    }
    const jobOffer = await jobOfferModel
      .findById(req.params.jobOfferId)
      .populate({
        path: "authorId",
        select: "_id name photoUrl accountType",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      });
    if (!jobOffer) {
      return res.status(404).json({ error: "404 job offer not found" });
    }
    res.status(200).json(jobOffer);
  } catch (error) {
    handleHttp(res, "Error_Get_Job_Offer", error);
  }
};

export const updateJobOfferById = async (req: Request, res: Response) => {
  const { jobTitle } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.jobOfferId)) {
      return res.status(400).json({ error: "invalid job offer id" });
    }
    const jobOffer = await jobOfferModel.findById(req.params.jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ error: "404 job offer not found" });
    }

    if (jobTitle) {
      req.body.jobTitleNormalize = convertTitleNormalize(jobTitle);
    }

    const jobOfferUpdated = await jobOfferModel.findByIdAndUpdate(
      req.params.jobOfferId,
      req.body,
      { new: true }
    );

    res.status(200).json(jobOfferUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_job_Offer", error);
  }
};

export const deleteJobOfferById = async (req: Request, res: Response) => {
  const jobOfferId = req.params.jobOfferId;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobOfferId)) {
      return res.status(400).json({ error: "invalid job offer id" });
    }
    const jobOffer = await jobOfferModel.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ error: "404 job offer not found" });
    }

    const jobOfferDeleted = await jobOfferModel.findByIdAndDelete(jobOfferId);
    await commentJobOfferModel.deleteMany({ jobOfferId });
    await likeJobOfferModel.deleteMany({ jobOfferId });
    await favoriteJobOfferModel.deleteMany({ jobOfferId });

    res.status(204).json(jobOfferDeleted);
  } catch (error) {
    handleHttp(res, "Error_Delete_Job_Offer", error);
  }
};

export const likeJobOffer = async (req: Request, res: Response) => {
  try {
    const jobOfferId = req.params.jobOfferId;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(jobOfferId)) {
      return res.status(400).json({ error: "invalid job offer id" });
    }
    const jobOffer = await jobOfferModel.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ error: "404 job offer not found" });
    }

    const isLikeJobOffer = await likeJobOfferModel.findOne({
      userId,
      jobOfferId,
    }); // return document likeJobOffer or null

    if (isLikeJobOffer) {
      await likeJobOfferModel.findByIdAndDelete(isLikeJobOffer._id);
    } else {
      await likeJobOfferModel.create({ userId, jobOfferId });
    }
    res.status(201).json({ like: Boolean(!isLikeJobOffer) });
  } catch (error) {
    handleHttp(res, "Error_Like_Job_Offer", error);
  }
};

export const favoriteJobOffer = async (req: Request, res: Response) => {
  try {
    const jobOfferId = req.params.jobOfferId;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(jobOfferId)) {
      return res.status(400).json({ error: "invalid job offer id" });
    }
    const jobOffer = await jobOfferModel.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ error: "404 job offer not found" });
    }

    const isFavoriteJobOffer = await favoriteJobOfferModel.findOne({
      userId,
      jobOfferId,
    }); // return document favoriteJobOffer or null

    if (isFavoriteJobOffer) {
      await favoriteJobOfferModel.findByIdAndDelete(isFavoriteJobOffer._id);
    } else {
      await favoriteJobOfferModel.create({ userId, jobOfferId });
    }
    res.status(201).json({ favorite: Boolean(!isFavoriteJobOffer) });
  } catch (error) {
    handleHttp(res, "Error_Add_Favorite_Job_Offer", error);
  }
};

export const getMyJobbOffers = async (req: Request, res: Response) => {
  const authorId = req.userId;

  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const jobOffers = await jobOfferModel
      .find({ authorId })
      .skip((page - 1) * limit)
      .limit(limit);

    let totalDocs = await jobOfferModel.count({ authorId }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: jobOffers,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_My_Job_Offers", error);
  }
};
