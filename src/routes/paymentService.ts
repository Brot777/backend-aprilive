import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  cancelOrder,
  captureOrder,
  createOrder,
} from "../controllers/paymentService";
import { isAuthorAccount } from "../middlewares/service";
const router = Router();

router.post(
  "/create-order/:serviceId",
  [isValidToken, isAuthorAccount],
  createOrder
);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelOrder);

export { router };
