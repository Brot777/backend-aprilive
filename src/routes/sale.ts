import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { getMyBalance, getMySales } from "../controllers/sale";

const router = Router();

router.get("/getMyBalance", isValidToken, getMyBalance);
router.get("/getMySales", isValidToken, getMySales);

export { router };
