import { model, Schema } from "mongoose";

const jobOfferQuestionSchema = new Schema(
  {
    jobOfferId: {
      type: Schema.Types.ObjectId,
      ref: "JobOffer",
      required: true,
    },
    question: {
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

export default model("JobOfferQuestion", jobOfferQuestionSchema);
