import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  cancelOrder,
  captureOrder,
  createOrder,
} from "../controllers/paymentService";
const router = Router();

router.post("/create-order/:serviceId", isValidToken, createOrder);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelOrder);

export { router };
