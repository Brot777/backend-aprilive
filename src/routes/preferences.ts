import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { getPreferences, updatePreferences } from "../controllers/preferences";
const router = Router();

router.get("/", getPreferences);
router.put("/:userId", isValidToken, updatePreferences);

export { router };
