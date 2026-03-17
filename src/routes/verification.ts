import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadImagesVerification } from "../middlewares/multerVerification";
import { createVerification, getPendindVerification, getStatusVerification } from "../controllers/verification";
import { isStatusAllowed } from "../middlewares/verification";
const router = Router();

router.post(
  "/",
  uploadImagesVerification.array("images"),
  [isValidToken, isStatusAllowed],
  createVerification
);

router.get("/status", isValidToken, getStatusVerification);
router.get("/verifications-request", isValidToken, getPendindVerification);

export { router };