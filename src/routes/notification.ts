import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import {
  getMyNotifications,
  updateReadNotificationById,
} from "../controllers/notification";
const router = Router();

router.get("/myNotifications", isValidToken, getMyNotifications);
router.patch("/:notificationId", isValidToken, updateReadNotificationById);

export { router };
