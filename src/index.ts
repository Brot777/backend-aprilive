import "dotenv/config";
import "./config/mongo";
import { PORT } from "./config/general";
import { server } from "./socket/socket";
server.listen(PORT);
console.log(`server on port ${PORT}`);
