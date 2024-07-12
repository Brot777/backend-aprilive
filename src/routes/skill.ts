import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { getSkills, updateSkills } from "../controllers/skill";
const router = Router();

router.get("/", getSkills);
router.put("/:userId", isValidToken, updateSkills);

export { router };
