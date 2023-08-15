import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import usersRoutes from "./routes/ùsers.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import countriesRoutes from "./routes/countries.routes.js";

// INITIAL EXPRESS
const app = express();

// CONFIG URL STATICS

const __dirname = dirname(fileURLToPath(import.meta.url));
const urlStatic = join(__dirname, "dist");

// MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//FILEUPLOAD
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./src/upload",
  })
);

//  ROUTES
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/countries", countriesRoutes);

/* STATIC FILES */
app.use(express.static(urlStatic));

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist/index.html"));
});

export default app;
