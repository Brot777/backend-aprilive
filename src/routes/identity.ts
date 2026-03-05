import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadImagesIdentity } from "../middlewares/multerIdentity";
import { createIdentity } from "../controllers/identity";
const router = Router();

router.post(
  "/",
  uploadImagesIdentity.array("images"),
  isValidToken,
  createIdentity
);

export { router };
