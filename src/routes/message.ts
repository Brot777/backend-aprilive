import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import {
  getMessagesByReceiverId,
  sendMessage,
  sendQuote,
  sendRequesQuote,
  updateReadMessageById,
} from "../controllers/message";

const router = Router();

router.post("/:receiverId", isValidToken, sendMessage);
router.post("/request-quote/:receiverId", isValidToken, sendRequesQuote);
router.post("/quote/:receiverId", isValidToken, sendQuote);
router.get("/:receiverId", isValidToken, getMessagesByReceiverId);
router.patch("/:messageId", isValidToken, updateReadMessageById);

export { router };
