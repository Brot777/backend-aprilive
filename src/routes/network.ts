import { Router } from "express";
import { getNetworks } from "../controllers/network";
const router = Router();

router.get("/", getNetworks);

export { router };
