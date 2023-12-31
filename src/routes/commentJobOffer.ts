import { Router } from "express";

import {
  createComment,
  getCommentsByJobOfferId,
  updateCommentById,
  deleteCommentById,
} from "../controllers/commentJobOffer";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/:jobOfferId", isValidToken, createComment);
router.get("/:jobOfferId", getCommentsByJobOfferId);
router.put("/:commentId", isValidToken, updateCommentById);
router.delete("/:commentId", isValidToken, deleteCommentById);

export { router };
