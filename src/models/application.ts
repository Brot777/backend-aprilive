import mongoose, { model, Schema } from "mongoose";

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
    answers: {
      type: [{ type: Schema.Types.ObjectId, ref: "JobOfferAnswer" }],
      default: [], //array de referencias de id {id, value}
    },
    cv: {
      type: Schema.Types.ObjectId,
      ref: "Cv",
      default: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Application", applicationSchema);
