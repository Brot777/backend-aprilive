import { model, Schema } from "mongoose";

const preferenceSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default new model("Preference", preferenceSchema);
