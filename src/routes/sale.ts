import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { getMyBalance } from "../controllers/sale";

const router = Router();

router.get("/getMyBalance", isValidToken, getMyBalance);

export { router };
