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
} from "../controllers/jobOffer";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/", isValidToken, createJobOffer);
router.get("/", getJobOffers);
router.get("/personalized", isValidToken, getPersonalizedJobOffers);
router.get("/:jobOfferId", getJobOfferById);
router.put("/:jobOfferId", isValidToken, updateJobOfferById);
router.patch("/like/:jobOfferId", isValidToken, likeJobOffer);
router.patch("/favorite/:jobOfferId", isValidToken, favoriteJobOffer);
router.delete("/:jobOfferId", deleteJobOfferById);

export { router };
