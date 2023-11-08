import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  getUsers,
  getUserProfile,
  updateUserById,
  deleteUserById,
  followUser,
} from "../controllers/ùsers";
const router = Router();

router.get("/", getUsers);
router.get("/profile/:userId", getUserProfile);
router.put("/:userId", isValidToken, updateUserById);
router.delete("/:userId", isValidToken, deleteUserById);
router.patch("/follow/:userId", isValidToken, followUser);

export { router };
