import { Router } from "express";

import {
  createService,
  deleteServiceById,
  getServiceById,
  getServices,
  getServicesByAuthorId,
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
/* router.get("/personalized", isValidToken, getPersonalizedServices); */
router.get("/services/:authorId", isValidToken, getServicesByAuthorId);
router.get("/:serviceId", getServiceById);
router.put(
  "/:serviceId",
  uploadImagesService.array("images"),
  isValidToken,
  updateServiceById
);
router.patch("/like/:serviceId", isValidToken, likeService);
router.delete("/:serviceId", isValidToken, deleteServiceById);

export { router };
