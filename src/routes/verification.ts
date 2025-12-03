import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { createPayout } from "../controllers/withdrawal";

const router = Router();

router.post("/upload-identification", isValidToken, createPayout);

export { router };
