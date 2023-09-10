import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadPresentationVideo } from "../middlewares/multerPresentationVideo";
import { createPresentationVideo } from "../controllers/presentationvideo";

const router = Router();

router.post(
  "/:userId",
  isValidToken,
  uploadPresentationVideo.single("presentationVideo"),
  createPresentationVideo
);

export { router };
