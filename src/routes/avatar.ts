import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadAvatar } from "../middlewares/multerAvatar";
import { createAvatar } from "../controllers/avatar";

const router = Router();

router.post(
  "/:userId",
  isValidToken,
  uploadAvatar.single("avatar"),
  createAvatar
);

export { router };
