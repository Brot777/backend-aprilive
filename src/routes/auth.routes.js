import { Router } from "express";
import {
  checkDuplicateEmail,
  checkDuplicateUsername,
} from "../middlewares/verifyUser.js";
import { singup, singin } from "./../controllers/auth.controllers.js";
const router = Router();

router.post("/singup", checkDuplicateUsername, checkDuplicateEmail, singup);
router.post("/singin", singin);

export default router;
