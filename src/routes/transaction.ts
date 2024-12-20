import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { getMyBalance, getMySales } from "../controllers/sale";
import { getMyTransactions } from "../controllers/transacction";

const router = Router();

router.get("/getMyBalance", isValidToken, getMyBalance);
router.get("/getMyTransactions", isValidToken, getMyTransactions);

export { router };
