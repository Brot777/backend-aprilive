import { Router } from "express";

import {
  createQuestionsByJobOfferId,
  getQuestionsByJobOfferId,
} from "../controllers/question";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post(
  "/createQuestions/:jobOfferId",
  isValidToken,
  createQuestionsByJobOfferId
);
router.get("/getQuestions/:jobOfferId", isValidToken, getQuestionsByJobOfferId);

export { router };
