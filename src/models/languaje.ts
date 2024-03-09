import { model, Schema } from "mongoose";

const languajeSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default model("Languaje", languajeSchema);
