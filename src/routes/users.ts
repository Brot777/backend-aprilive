import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  getUsers,
  getUserProfile,
  updateUserById,
  deleteUserById,
  updatePasswordByUserId,
  deepLinkUserProfile,
} from "../controllers/users";
const router = Router();

router.get("/", getUsers);
router.get("visitUser", deepLinkUserProfile);
router.get("/profile/:userId", getUserProfile);
router.put("/:userId", isValidToken, updateUserById);
router.delete("/:userId", isValidToken, deleteUserById);
router.patch("/updatePassword", isValidToken, updatePasswordByUserId);
11111;

export { router };
