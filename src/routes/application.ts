import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  applyJobOffer,
  isApplicant,
  getApplicantsByJobOfferId,
  getAplicantionById,
  updateStepByApplicationId,
  getMyApplications,
} from "../controllers/application";
const router = Router();

router.post("/applyJobOffer/:jobOfferId", isValidToken, applyJobOffer);
router.get("/myApplications", isValidToken, getMyApplications);
router.get("/isApplicant/:jobOfferId", isValidToken, isApplicant);
router.get(
  "/getApplicants/:jobOfferId",
  isValidToken,
  getApplicantsByJobOfferId
);
router.get("/:applicationId", isValidToken, getAplicantionById);
router.put("/updateStep/:applicationId", updateStepByApplicationId);

export { router };
