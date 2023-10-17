import { Router } from "express";

import {
  createComment,
  getCommentsByJobOfferId,
  updateCommentById,
  deleteCommentById,
} from "../controllers/commentJobOffer";
import { isValidToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/", isValidToken, createComment);
router.get("/:resourceId", getCommentsByJobOfferId);
router.put("/:commentId", isValidToken, updateCommentById);
router.delete("/:commentId", isValidToken, deleteCommentById);

export { router };
