import { Router } from "express";

import {
  createComment,
  getCommentsByServiceId,
  updateCommentById,
  deleteCommentById,
} from "../controllers/commentService";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/:serviceId", isValidToken, createComment);
router.get("/:serviceId", getCommentsByServiceId);
router.put("/:commentId", isValidToken, updateCommentById);
router.delete("/:commentId", isValidToken, deleteCommentById);

export { router };
