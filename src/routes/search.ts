import { Router } from "express";

import { isValidToken } from "../middlewares/verifyToken";
import { searchJobOffers } from "../controllers/search";
const router = Router();

router.get("/jobOffer", searchJobOffers);

export { router };
