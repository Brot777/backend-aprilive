import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  createDisputeByServiceHiringId,
  getCustomerDisputes,
  getSellerDisputes,
} from "../controllers/disputes";

const router = Router();

router.post("/:serviceHiringId", isValidToken, createDisputeByServiceHiringId);
router.get("/my-customer-disputes", isValidToken, getCustomerDisputes);
router.get("/my-seller-disputes", isValidToken, getSellerDisputes);

export { router };
