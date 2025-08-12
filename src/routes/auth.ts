import { Router } from "express";
import {
  checkDuplicateEmail,
  checkDuplicateUsername,
} from "../middlewares/verifyUser";
import { singup, singin, recoverPassword } from "../controllers/auth";
const router = Router();

router.post("/singup", checkDuplicateUsername, checkDuplicateEmail, singup);
router.post("/singin", singin);
router.post("/recover-password/email", recoverPassword);

export { router };
