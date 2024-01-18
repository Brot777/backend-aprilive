import { model, Schema } from "mongoose";

const jobOfferAnswerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "JobOfferQuestion",
      required: true,
    },
    answer: {
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

export default model("JobOfferAnswer", jobOfferAnswerSchema);
