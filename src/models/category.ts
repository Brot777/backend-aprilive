import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Category", categorySchema);
