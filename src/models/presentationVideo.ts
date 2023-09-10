import { model, Schema } from "mongoose";

const presentationVideoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("PresentationVideo", presentationVideoSchema);
