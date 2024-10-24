import { model, Schema } from "mongoose";
import { FavoriteJobOffer } from "../interfaces/favoriteJobOffer";

const favoriteJobOfferSchema = new Schema<FavoriteJobOffer>(
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

export default model("FavoriteJobOffer", favoriteJobOfferSchema);
