import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  cancelSubscription,
  subscribeToPremiumCompany,
  successSubscription,
} from "../controllers/paymentPlan";
const router = Router();

router.post(
  "/company/premium/subscribe",
  [isValidToken],
  subscribeToPremiumCompany
);
router.get("/company/premium/success", successSubscription);
router.get("/company/premium/cancel", cancelSubscription);

export { router };
