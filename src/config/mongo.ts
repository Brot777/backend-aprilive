import mongoose from "mongoose";
import { createInitialData } from "../libs/initialSetup/initialSetup";

const URI = process.env.MONGODB_URI || "";
export default async function main() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(URI);
  console.log("database is connected");
  createInitialData();
}

main().catch((err) => console.log(err));
