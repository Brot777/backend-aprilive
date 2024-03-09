import { model, Schema } from "mongoose";

const userLanguajeSchema = new Schema(
  {
    languaje: {
      type: Schema.Types.ObjectId,
      ref: "Languaje",
      required: true,
    },
    level: {
      type: String,
      default: "",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("UserLanguaje", userLanguajeSchema);
