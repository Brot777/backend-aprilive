import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { getMyBalance, getMyTransactions } from "../controllers/transaction";

const router = Router();

router.get("/getMyBalance", isValidToken, getMyBalance);
router.get("/getMyTransactions", isValidToken, getMyTransactions);

export { router };
