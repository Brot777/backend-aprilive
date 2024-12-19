import { Router } from "express";
import { isValidToken } from "../middlewares/verifyToken";
import { uploadCv } from "../middlewares/multerCv";
import { createCv, getMyCv, updateCv } from "../controllers/cv";

const router = Router();

router.post("/", isValidToken, uploadCv.single("cv"), createCv);
router.get("/myCv", isValidToken, getMyCv);
router.put("/", isValidToken, uploadCv.single("cv"), updateCv);

export { router };
