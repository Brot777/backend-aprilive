import { Router } from "express";
import {
  createUserLanguajeByUserId,
  deleteUserLanguajeById,
  getAllLanguajes,
  updateUserLanguajenById,
} from "../controllers/languaje";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.get("/", getAllLanguajes);
router.post("/:userId", isValidToken, createUserLanguajeByUserId);
router.put("/:experienceId", isValidToken, updateUserLanguajenById);
router.delete("/:experienceId", isValidToken, deleteUserLanguajeById);

export { router };
