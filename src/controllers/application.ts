import mongoose, { ObjectId } from "mongoose";
import { Request, Response } from "express";
import applicationModel from "../models/application";
import jobOfferModel from "../models/jobOffer";
import jobOfferAnswerModel from "../models/jobOfferAnswer";
import { handleHttp } from "../utils/error.handle";
import notificationModel from "../models/notification";
import { getSocketIdByUserId, io } from "../socket/socket";

export const applyJobOffer = async (req: Request, res: Response) => {
  const jobOfferId = req.params.jobOfferId;
  const applicantId = req.userId;
  const { answers = [], cv } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobOfferId)) {
      return res.status(400).json({ error: "invalid job offer id" });
    }
    const jobOffer = await jobOfferModel.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ error: "404 job offer not found" });
    }

    const authorId = jobOffer.authorId as ObjectId;

    if (applicantId == authorId.toString()) {
      return res
        .status(400)
        .json({ error: "the creator cannot apply to your job offer" });
    }

    const currentDate = new Date();
    const dateExpiration = new Date(jobOffer.expirationDate);
    const isExpired = jobOffer.expirationDate
      ? currentDate.getTime() > dateExpiration.getTime()
      : false;

    if (isExpired) {
      return res.status(400).json({ error: "This job offer has expired" });
    }
    const isApplicant = await applicationModel.findOne({
      jobOfferId,
      applicantId,
    });

    if (isApplicant) {
      return res.status(400).json({ error: "This user has already applied" });
    }
    const answerSaved = await jobOfferAnswerModel.insertMany(answers);
    const answerIds = answerSaved.map((answer) => answer._id);
    const applicationSaved = await applicationModel.create({
      jobOfferId,
      applicantId,
      answers: answerIds,
      cv,
    });

    // REAL TIME
    const notificationSaved = await notificationModel.create({
      description: "Alguien aplico a tu oferta de trabajo",
      type: "Application",
      referenceId: jobOfferId,
      receiverId: authorId,
    });
    const reseiverSocketId = getSocketIdByUserId(authorId);
    console.log(reseiverSocketId);

    if (reseiverSocketId)
      io.to(reseiverSocketId).emit("newNotification", notificationSaved);
    // FINISH REAL TIME

    res.status(200).json(applicationSaved);
  } catch (error) {
    handleHttp(res, "Error_Apply_Job_Offer", error);
  }
};

export const getAplicantionById = async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId;
  try {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: "invalid application id" });
    }
    const application = await applicationModel
      .findById(applicationId)
      .populate({
        path: "applicantId",
        select: "name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "answers",
        select: "-_id questionId answer",
        populate: {
          path: "questionId",
          select: "-_id question",
        },
      })
      .populate({
        path: "cv",
        select: "url",
      });
    if (!application) {
      return res.status(404).json({ error: "404 not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    handleHttp(res, "Error_Get_Application", error);
  }
};

export const updateStepId = async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId;
  let { step } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: "Invalid application Id" });
    }
    const application = await applicationModel.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: "404 application not found" });
    }
    const applicationUpdated = await applicationModel.findByIdAndUpdate(
      applicationId,
      { step },
      {
        new: true,
      }
    );
    res.status(200).json(applicationUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Step", error);
  }
};

export const isApplicant = async (req: Request, res: Response) => {
  const jobOfferId = req.params.jobOfferId;
  const applicantId = req.userId;
  try {
    const applicant = await applicationModel.findOne({
      jobOfferId,
      applicantId,
    });

    return res.status(200).json({ isApplicant: Boolean(applicant) });
  } catch (error) {
    handleHttp(res, "Error_Get_Is_Applicant", error);
  }
};

export const getApplicantsByJobOfferId = async (
  req: Request,
  res: Response
) => {
  const jobOfferId = req.params.jobOfferId;
  const authorId = req.userId;

  try {
    if (!mongoose.Types.ObjectId.isValid(jobOfferId)) {
      return res.status(400).json({ error: "invalid job offer id" });
    }
    const jobOffer = await jobOfferModel.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ error: "404 job offer not found" });
    }

    if (jobOffer.authorId.toString() !== authorId) {
      return res.status(401).json({
        error: "unauthorized, you are not the author of this job offer",
      });
    }
    console.log(jobOffer, authorId);

    const applicants = await applicationModel
      .find({
        jobOfferId,
      })
      .populate({
        path: "applicantId",
        select: "name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "answers",
        select: "-_id questionId answer",
        populate: {
          path: "questionId",
          select: "-_id question",
        },
      })
      .populate({
        path: "cv",
        select: "url",
      });

    return res.status(200).json(applicants);
  } catch (error) {
    handleHttp(res, "Error_Get_Applicants", error);
  }
};
