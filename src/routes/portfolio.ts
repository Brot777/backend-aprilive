import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import {
  createPortfolio,
  deletePortfolioById,
  getPortfoliosByAuthorId,
  getPersonalizedPortfolios,
  getPortfolioById,
  getPortfolios,
  likePortfolio,
  updatePortfolioById,
} from "../controllers/portfolio";
import { uploadImagesPortfolio } from "../middlewares/multerPortfolio";
const router = Router();

router.post(
  "/",
  uploadImagesPortfolio.array("images"),
  isValidToken,
  createPortfolio
);
router.get("/", getPortfolios);
router.get("/personalized", isValidToken, getPersonalizedPortfolios);
router.get("/portfolios/:authorId", isValidToken, getPortfoliosByAuthorId);
router.get("/:portfolioId", getPortfolioById);
router.put(
  "/:portfolioId",
  uploadImagesPortfolio.array("images"),
  isValidToken,
  updatePortfolioById
);
router.patch("/like/:portfolioId", isValidToken, likePortfolio);
router.delete("/:portfolioId", isValidToken, deletePortfolioById);

export { router };
