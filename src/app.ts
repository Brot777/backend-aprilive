import express from "express";
import { join } from "path";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index";

// INITIAL EXPRESS
const app = express();

// CONFIG URL STATICS

const urlStatic = join(__dirname, "dist");

// MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//  ROUTES
app.use("/api/", routes);

/* STATIC FILES */
app.use(express.static(urlStatic));

export default app;
