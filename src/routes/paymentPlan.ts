import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { cancelOrder, captureOrder } from "../controllers/paymentService";
import { subscribeToPremiumCompany } from "../controllers/paymentPlan";
const router = Router();

router.post(
  "/company/premium/subscribe",
  [isValidToken],
  subscribeToPremiumCompany
);
/* router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelOrder); */

export { router };
