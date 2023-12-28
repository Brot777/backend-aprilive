import { model, Schema } from "mongoose";

const imagePorfolioSchema = new Schema(
  {
    url: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("ImagePortfolio", imagePorfolioSchema);
