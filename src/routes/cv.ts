import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadCv } from "../middlewares/multerCv";
import { createCv } from "../controllers/cv";

const router = Router();

router.post("/:userId", isValidToken, uploadCv.single("cv"), createCv);

export { router };
