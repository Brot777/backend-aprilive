import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
async function main() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(URI);
  console.log("database is connected");
}

main().catch((err) => console.log(err));
