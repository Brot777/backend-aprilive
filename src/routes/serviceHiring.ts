import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  getMyServiceHiring,
  updateServiceHiringStatusById,
} from "../controllers/serviceHiring";
const router = Router();

router.get("/myServiceHirings", isValidToken, getMyServiceHiring);
router.put(
  "/update-status/:serviceHiringId",
  isValidToken,
  updateServiceHiringStatusById
);

export { router };
