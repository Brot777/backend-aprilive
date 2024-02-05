import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadCv } from "../middlewares/multerCv";
import { createCv, getCv } from "../controllers/cv";

const router = Router();

router.post("/:userId", isValidToken, uploadCv.single("cv"), createCv);
router.get("/:userId", isValidToken, getCv);

export { router };
