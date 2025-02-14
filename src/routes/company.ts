import { Router } from "express";

import {
  createCompany,
  getMyCompanies,
  getCompanyProfileById,
  updatecompanyById,
  deleteCompanyById,
  switchToCompanyAccountById,
  switchToOwnerAccount,
} from "../controllers/company";
import { isValidToken } from "../middlewares/verifyToken";
import { isUser } from "../middlewares/user";
import {
  isCompany,
  isOwnerAccountCompany,
  verifyActiveSubcription,
} from "../middlewares/company";

const router = Router();

router.post(
  "/",
  [isValidToken, isUser, verifyActiveSubcription],
  createCompany
);
router.get("/myCompanies", isValidToken, getMyCompanies);
router.get("/profile/:companyUserId", getCompanyProfileById);
router.put(
  "/:companyUserId",
  [isValidToken, isCompany, isOwnerAccountCompany],
  updatecompanyById
);
router.delete(
  "/:companyUserId",
  [isValidToken, isCompany, isOwnerAccountCompany],
  deleteCompanyById
);

router.post(
  "/switchToCompany/:companyUserId",
  [isValidToken, isUser],
  switchToCompanyAccountById
);

router.post("/switchToOwner", [isValidToken, isCompany], switchToOwnerAccount);

export { router };
