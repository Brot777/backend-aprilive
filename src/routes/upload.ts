import { Router } from "express";
import { uploadPhoto } from "../controllers/upload.controllers";

const router = Router();

router.post("/", uploadPhoto);

export { router };
