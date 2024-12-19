import { model, Schema } from "mongoose";

const jobOfferAnswerSchema = new Schema(
  {
    question: {
      type: String,
      default: "",
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
