import { Router } from "express";
import { uploadPhoto } from "../controllers/upload.controllers.js";

const router = Router();

router.post("/", uploadPhoto);

export default router;
