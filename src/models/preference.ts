import { model, Schema } from "mongoose";

const preferenceSchema = new Schema(
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

export default model("Preference", preferenceSchema);
