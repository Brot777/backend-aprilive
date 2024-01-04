import { Router } from "express";

/* import {
  createPortfolio,
   deleteServiceById,
  getMyServices,
  getPersonalizedServices,
  getServiceById,
  getServices,
  likeService,
  updateServiceById,
} from "../controllers/portfolio"; */
import { isValidToken } from "../middlewares/verifyToken";
import {
  createPortfolio,
  deletePortfolioById,
  getMyPortfolios,
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
router.get("/myPortfolios", isValidToken, getMyPortfolios);
router.get("/:portfolioId", getPortfolioById);
router.put("/:portfolioId", isValidToken, updatePortfolioById);
router.patch("/like/:portfolioId", isValidToken, likePortfolio);
router.delete("/:portfolioId", isValidToken, deletePortfolioById);

export { router };
