import { Router } from "express";

import { createReviewByServiceHiringId } from "../controllers/review";
import { isValidToken } from "../middlewares/verifyToken";
import { verrifyReviewCreated } from "../middlewares/review";
const router = Router();

router.post(
  "/:serviceHiringId",
  [isValidToken, verrifyReviewCreated],
  createReviewByServiceHiringId
);

export { router };
