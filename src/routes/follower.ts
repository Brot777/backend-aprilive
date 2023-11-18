import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { followById, dataFollow } from "../controllers/follower";
const router = Router();

router.post("/follow/:userId", isValidToken, followById);
router.get("/dataFollow/:userId", isValidToken, dataFollow);

export { router };
