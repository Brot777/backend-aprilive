import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { createDisputeByServiceHiringId } from "../controllers/disputes";

const router = Router();

router.post("/", isValidToken, createDisputeByServiceHiringId);

export { router };
