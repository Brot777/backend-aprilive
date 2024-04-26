import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import { getMessagesByReceiverId, sendMessage } from "../controllers/message";

const router = Router();

router.post("/:receiverId", isValidToken, sendMessage);
router.get("/:receiverId", isValidToken, getMessagesByReceiverId);

export { router };
