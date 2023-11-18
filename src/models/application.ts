import { model, Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    jobOfferId: {
      type: Schema.Types.ObjectId,
      ref: "JobOffer",
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Application", applicationSchema);
