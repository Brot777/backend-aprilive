import { model, Schema } from "mongoose";
import { LikeJobOffer } from "../interfaces/likeJobOffer";

const likeJobOfferSchema = new Schema<LikeJobOffer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobOfferId: {
      type: Schema.Types.ObjectId,
      ref: "JobOffer",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("LikeJobOffer", likeJobOfferSchema);
