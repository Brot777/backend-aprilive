import { Router } from "express";
import {
  createEducationByUserId,
  deleteEduacationById,
  updateEducationById,
} from "../controllers/education";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/:userId", isValidToken, createEducationByUserId);
router.put("/:educationId", isValidToken, updateEducationById);
router.delete("/:educationId", isValidToken, deleteEduacationById);

export { router };
