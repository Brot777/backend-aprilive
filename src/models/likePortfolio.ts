import { model, Schema } from "mongoose";

const likePortfolioSchema = new Schema(
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
