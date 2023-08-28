import { model, Schema } from "mongoose";

const educationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Education", educationSchema);
