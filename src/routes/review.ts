import { Router } from "express";

import { createReviewByServiceId } from "../controllers/review";
const router = Router();

router.post("/:serviceId", createReviewByServiceId);

export { router };
