import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";

import {
  cancelSubcriptionById,
  getMySubscriptions,
} from "../controllers/subscription";

const router = Router();

router.get("/getMySubcriptions", isValidToken, getMySubscriptions);
router.post("/cancel-subcription", isValidToken, cancelSubcriptionById);
router.post("/webhook/cancel-subcription", isValidToken, cancelSubcriptionById);

export { router };
