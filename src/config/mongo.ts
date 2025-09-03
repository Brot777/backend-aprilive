import mongoose from "mongoose";
import { createInitialData } from "../libs/initialSetup/initialSetup";
import { uptdateEmailToObject } from "../utils/updateUsers";

const URI = process.env.MONGODB_URI || "";
export default async function main() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(URI);
  console.log("database is connected");
  await createInitialData();
  await uptdateEmailToObject();
}

main().catch((err) => console.log(err));
