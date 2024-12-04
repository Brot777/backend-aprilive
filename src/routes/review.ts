import { Router } from "express";

import { createReviewByServiceHiringId } from "../controllers/review";
import { isValidToken } from "../middlewares/verifyToken";
import {
  verrifyReviewCreated,
  verrifyStatusCompleted,
} from "../middlewares/review";
const router = Router();

router.post(
  "/:serviceHiringId",
  [isValidToken, verrifyStatusCompleted, verrifyReviewCreated],
  createReviewByServiceHiringId
);

export { router };
