import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadImagesVerification } from "../middlewares/multerVerification";
import { changeStatusByVerificationId, createVerification, getMyVerifications, getPendindVerification, getStatusVerification } from "../controllers/verification";
import { isInAllowedRange, isStatusAllowed } from "../middlewares/verification";
const router = Router();

router.post(
  "/",
  uploadImagesVerification.array("images"),
  [isValidToken,isInAllowedRange, isStatusAllowed ],
  createVerification
);

router.get("/status", isValidToken, getStatusVerification);
router.get("/verifications-request", isValidToken, getPendindVerification);
router.get("/my-verifications", isValidToken, getMyVerifications);
router.patch("/verify-user/:verificationId", isValidToken, changeStatusByVerificationId);

export { router };