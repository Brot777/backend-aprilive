import { Router } from "express";
import { getCities, getCountries, getStates } from "../controllers/coutries";

const router = Router();

router.get("/", getCountries);
router.get("/states/:countryName", getStates);
router.get("/cities/:stateName", getCities);

export { router };
