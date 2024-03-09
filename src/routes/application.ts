import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  applyJobOffer,
  isApplicant,
  getApplicantsByJobOfferId,
} from "../controllers/application";
const router = Router();

router.post("/applyJobOffer/:jobOfferId", isValidToken, applyJobOffer);
router.get("/:applicantId", isValidToken, getApplicantsByJobOfferId);
router.get("/isApplicant/:jobOfferId", isValidToken, isApplicant);
router.get(
  "/getApplicants/:jobOfferId",
  isValidToken,
  getApplicantsByJobOfferId
);

export { router };
