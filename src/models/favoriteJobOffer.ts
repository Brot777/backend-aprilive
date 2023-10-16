import { model, Schema } from "mongoose";

const favoriteJobOfferSchema = new Schema(
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

export default model("favoriteJobOffer", favoriteJobOfferSchema);
