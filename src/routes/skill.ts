import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { getSkills } from "../controllers/skill";
const router = Router();

router.get("/", getSkills);

export { router };
