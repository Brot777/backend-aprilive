import { model, Schema } from "mongoose";
import { ImagePortfolio } from "../interfaces/imagePortfolio";

const imagePorfolioSchema = new Schema<ImagePortfolio>(
  {
    url: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    Key: {
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
