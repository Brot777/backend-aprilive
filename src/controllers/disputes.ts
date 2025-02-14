import mongoose, { ObjectId } from "mongoose";
import { Request, Response } from "express";
import applicationModel from "../models/application";
import jobOfferModel from "../models/jobOffer";
import { v4 as uuidv4 } from "uuid";
import { handleHttp } from "../utils/error.handle";
import notificationModel from "../models/notification";
import { getSocketIdByUserId, io } from "../socket/socket";
import serviceHiringModel from "../models/serviceHiring";
import disputeModel from "../models/dispute";

export const createDisputeByServiceHiringId = async (
  req: Request,
  res: Response
) => {
  const serviceHiringId = req.params.serviceHiringId;
  const applicantId = req.userId;
  const { description } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceHiringId)) {
      return res.status(400).json({ error: "invalid dispute id" });
    }
    const serviceHiring = await serviceHiringModel.findById(serviceHiringId);
    if (!serviceHiring) {
      return res.status(404).json({ error: "404 service hiring not found" });
    }
    const disputeId = `payout_${uuidv4()}`;
    const disputeSaved = await disputeModel.create({
      disputeId,
      serviceHiringId,
      description,
    });
    const disputeFind = await disputeModel
      .findById(disputeSaved._id)
      .populate("serviceId");

    // REAL TIME
    /* const notificationSaved = await notificationModel.create({
      description: "Alguien aplico a tu oferta de trabajo",
      type: "dispute",
      referenceId: jobOfferId,
      receiverId: authorId,
    });
    const reseiverSocketId = getSocketIdByUserId(authorId);

    if (reseiverSocketId)
      io.to(reseiverSocketId).emit("newNotification", notificationSaved); */
    // FINISH REAL TIME

    res.status(200).json(disputeFind);
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
        select: "question answer",
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

export const updateStepByApplicationId = async (
  req: Request,
  res: Response
) => {
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
        select: "question answer",
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
export const getMyApplications = async (req: Request, res: Response) => {
  const applicantId = req.userId;
  console.log(applicantId);

  try {
    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({ error: "invalid user id" });
    }
    const applications = await applicationModel.find({ applicantId }).populate({
      path: "jobOfferId",
      select: "status jobTitle description",
    });

    return res.status(200).json(applications);
  } catch (error) {
    handleHttp(res, "Error_Get_My_Applications", error);
  }
};
