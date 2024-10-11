import { Router } from "express";

import { createReviewByServiceId } from "../controllers/review";
import { isValidToken } from "../middlewares/verifyToken";
const router = Router();

router.post("/:serviceId", isValidToken, createReviewByServiceId);

export { router };
