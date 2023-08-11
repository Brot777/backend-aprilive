import { model, Schema } from "mongoose";

const preferenceSchema = new Schema(
  {
    name: {
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
