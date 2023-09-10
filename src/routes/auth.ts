import { Router } from "express";
import {
  checkDuplicateEmail,
  checkDuplicateUsername,
} from "../middlewares/verifyUser";
import { singup, singin } from "../controllers/auth";
const router = Router();

router.post("/singup", checkDuplicateUsername, checkDuplicateEmail, singup);
router.post("/singin", singin);

export { router };
