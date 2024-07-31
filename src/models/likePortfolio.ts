import { model, Schema } from "mongoose";
import { LikePortfolio } from "../interfaces/likePortfolio";

const likePortfolioSchema = new Schema<LikePortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("LikePortfolio", likePortfolioSchema);
