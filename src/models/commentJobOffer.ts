import { model, Schema } from "mongoose";

const commentJobOfferSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },

    authorId: {
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
export default model("CommentJobOffer", commentJobOfferSchema);
