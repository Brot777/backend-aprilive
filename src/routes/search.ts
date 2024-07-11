import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import {
  searchJobOffers,
  searchPortfolios,
  searchServices,
} from "../controllers/search";
const router = Router();

router.get("/jobOffer", searchJobOffers);
router.get("/service", searchServices);
router.get("/portfolio", searchPortfolios);

export { router };
