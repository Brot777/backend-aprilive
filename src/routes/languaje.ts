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
router.put("/:userLanguajeId", isValidToken, updateUserLanguajenById);
router.delete("/:userLanguajeId", isValidToken, deleteUserLanguajeById);

export { router };
