import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  createDisputeByServiceHiringId,
  getCustomerDisputes,
  getSellerDisputes,
  updateGeneralStatusById,
  updateSellerResponseById,
} from "../controllers/disputes";
import { verrifyDisputeCreated } from "../middlewares/disapute";

const router = Router();

router.post(
  "/:serviceHiringId",
  [isValidToken, verrifyDisputeCreated],
  createDisputeByServiceHiringId
);
router.get("/my-customer-disputes", isValidToken, getCustomerDisputes);
router.get("/my-seller-disputes", isValidToken, getSellerDisputes);
router.patch(
  "/update-seller-response/:disputeId",
  isValidToken,
  updateSellerResponseById
);
router.patch(
  "/update-general-status/:disputeId",
  isValidToken,
  updateGeneralStatusById
);

export { router };
