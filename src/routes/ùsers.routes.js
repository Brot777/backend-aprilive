import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken.js";
import {
  getUsers,
  getUserProfile,
  updateUserById,
  deleteUserById,
} from "./../controllers/ùsers.controllers.js";
const router = Router();

router.get("/", getUsers);
router.get("/profile/:userId", getUserProfile);
router.put("/:userId", isValidToken, updateUserById);
router.delete("/:userId", isValidToken, deleteUserById);

export default router;
