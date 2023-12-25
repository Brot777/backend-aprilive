import { Router } from "express";

import {
  createService,
  deleteServiceById,
  getMyServices,
  getPersonalizedServices,
  getServiceById,
  getServices,
  likeService,
  updateServiceById,
} from "../controllers/service";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadImagesService } from "../middlewares/multerService";
const router = Router();

router.post(
  "/",
  uploadImagesService.array("images"),
  isValidToken,
  createService
);
router.get("/", getServices);
router.get("/personalized", isValidToken, getPersonalizedServices);
router.get("/myServices", isValidToken, getMyServices);
router.get("/:serviceId", getServiceById);
router.put("/:serviceId", isValidToken, updateServiceById);
router.patch("/like/:serviceId", isValidToken, likeService);
router.delete("/:serviceId", isValidToken, deleteServiceById);

export { router };
