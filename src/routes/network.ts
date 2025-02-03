import { Router } from "express";
import {
  createUserNetworkByUserId,
  deleteuserNetworkById,
  getAllNetworks,
  updateUserNetworkById,
} from "../controllers/network";
import { isValidToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getAllNetworks);
router.post("/:userId", isValidToken, createUserNetworkByUserId);
router.put("/:userNetworkId", isValidToken, updateUserNetworkById);
router.delete("/:userNetworkId", isValidToken, deleteuserNetworkById);

export { router };
