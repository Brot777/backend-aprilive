import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import { getMyServiceHiring } from "../controllers/serviceHiring";
const router = Router();

router.get("/myServiceHirings", isValidToken, getMyServiceHiring);

export { router };
