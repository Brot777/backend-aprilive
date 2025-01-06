import { Router } from "express";

import { createReviewByServiceHiringId } from "../controllers/review";
import { isValidToken } from "../middlewares/verifyToken";
import {
  isCustomer,
  verrifyReviewCreated,
  verrifyStatusCompleted,
} from "../middlewares/review";
const router = Router();

router.post(
  "/:serviceHiringId",
  [isValidToken, isCustomer, verrifyStatusCompleted, verrifyReviewCreated],
  createReviewByServiceHiringId
);

export { router };
