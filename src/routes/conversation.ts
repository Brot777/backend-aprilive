import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import { getMyConversations } from "../controllers/conversation";

const router = Router();

router.get("/myConversation", isValidToken, getMyConversations);

export { router };
