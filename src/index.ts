import "dotenv/config";
import "./config/mongo";
import { PORT } from "./config/general";
import app from "./app";
app.listen(PORT);
console.log(`server on port ${PORT}`);
