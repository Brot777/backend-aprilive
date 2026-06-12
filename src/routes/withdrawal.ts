import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { changeStatusWithdrawalById, createPayout, getPendingWithdrawals } from "../controllers/withdrawal";
import { isAccontAllowed } from "../middlewares/verification";

const router = Router();

router.post("/withdraw-money", isValidToken, createPayout);
router.get("/withdrawal-pending", [isValidToken, isAccontAllowed], getPendingWithdrawals);
router.patch("/change-paid/:withdrawalId", [isValidToken, isAccontAllowed], changeStatusWithdrawalById);

export { router };
