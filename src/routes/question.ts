import { Router } from "express";

import {
  getQuestionsByJobOfferId,
  updateQuestionsByJobOfferId,
} from "../controllers/question";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.get("/getQuestions/:jobOfferId", isValidToken, getQuestionsByJobOfferId);
router.put(
  "/updateQuestions/:jobOfferId",
  isValidToken,
  updateQuestionsByJobOfferId
);

export { router };
