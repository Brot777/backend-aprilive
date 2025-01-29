import { Router } from "express";

import {
  createJobOffer,
  deleteJobOfferById,
  getJobOfferById,
  getJobOffers,
  getPersonalizedJobOffers,
  likeJobOffer,
  favoriteJobOffer,
  updateJobOfferById,
  getJobbOffersByAuthorId,
} from "../controllers/jobOffer";
import { isValidToken } from "../middlewares/verifyToken";
import { verifyActiveSubcription } from "../middlewares/jobOffer";

const router = Router();

router.post("/", [isValidToken, verifyActiveSubcription], createJobOffer);
router.get("/", getJobOffers);
router.get("/personalized", isValidToken, getPersonalizedJobOffers);
router.get("/jobOffers/:authorId", isValidToken, getJobbOffersByAuthorId);
router.get("/:jobOfferId", getJobOfferById);
router.put("/:jobOfferId", isValidToken, updateJobOfferById);
router.patch("/like/:jobOfferId", isValidToken, likeJobOffer);
router.patch("/favorite/:jobOfferId", isValidToken, favoriteJobOffer);
router.delete("/:jobOfferId", deleteJobOfferById);

export { router };
