import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  getMyServiceHiring,
  changeCompletedByServiceHiringId,
} from "../controllers/serviceHiring";
import { isCustomer } from "../middlewares/serviceHiring";
const router = Router();

router.get("/myServiceHirings", isValidToken, getMyServiceHiring);
router.put(
  "/update-status/:serviceHiringId",
  isValidToken,
  isCustomer,
  changeCompletedByServiceHiringId
);

export { router };
