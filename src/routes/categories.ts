import { Router } from "express";
import { addManyCategories, getCategories } from "../controllers/categories";
import { isValidToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getCategories);
router.post("/add-many", isValidToken, addManyCategories);

export { router };
