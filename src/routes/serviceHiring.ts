import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  getMyServiceHiring,
  changeCompletedByServiceHiringId,
} from "../controllers/serviceHiring";
const router = Router();

router.get("/myServiceHirings", isValidToken, getMyServiceHiring);
router.put(
  "/update-status/:serviceHiringId",
  isValidToken,
  changeCompletedByServiceHiringId
);

export { router };
