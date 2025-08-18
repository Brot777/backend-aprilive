import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import {
  getUsers,
  getUserProfile,
  updateUserById,
  deleteUserById,
  updatePasswordByUserId,
  deepLinkUserProfile,
  temporalUpdatePassword,
  deepLinkChangePassword,
  recoverAccount,
} from "../controllers/users";
const router = Router();

router.get("/", getUsers);
router.get("/visitUser", deepLinkUserProfile);
router.get("/change-password/:token", deepLinkChangePassword);
router.get("/profile/:userId", getUserProfile);
router.put("/:userId", isValidToken, updateUserById);
router.delete("/:userId", isValidToken, deleteUserById);
router.patch("/updatePassword", isValidToken, updatePasswordByUserId);
router.patch("/recover-account", isValidToken, recoverAccount);
router.patch("/temporalPassword", isValidToken, temporalUpdatePassword);

export { router };
