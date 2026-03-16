import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadImagesVerification } from "../middlewares/multerVerification";
import { createVerification, getStatusVerification } from "../controllers/verification";
import { isStatusAllowed } from "../middlewares/verification";
const router = Router();

router.post(
  "/",
  uploadImagesVerification.array("images"),
  [isValidToken,isStatusAllowed],
  createVerification
);

router.get("/status",isValidToken,getStatusVerification)

export { router };