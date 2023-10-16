import { Router } from "express";

import {
  createJobOffer,
  deleteJobOfferById,
  getJobOfferById,
  getJobOffers,
  getPersonalizedJobOffers,
  likeJobOffer,
  updateJobOfferById,
} from "../controllers/jobOffer";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/", createJobOffer);
router.get("/", getJobOffers);
router.get("/personalized", isValidToken, getPersonalizedJobOffers);
router.get("/:jobOfferId", getJobOfferById);
router.put("/:jobOfferId", updateJobOfferById);
router.patch("/like/:jobOfferId", isValidToken, likeJobOffer);
router.delete("/:jobOfferId", deleteJobOfferById);

export { router };
