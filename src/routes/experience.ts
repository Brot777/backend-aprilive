import { Router } from "express";
import {
  createExperienceByUserId,
  deleteExperiencesById,
  updateExperiencesById,
} from "../controllers/experience";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/:userId", isValidToken, createExperienceByUserId);
router.put("/:experienceId", isValidToken, updateExperiencesById);
router.delete("/:experienceId", isValidToken, deleteExperiencesById);

export { router };
