import "dotenv/config";
import "./database.js";
import { PORT } from "./config/general.js";
import app from "./app.js";
app.listen(PORT);
console.log(`server on port ${PORT}`);
