import { model, Schema } from "mongoose";

const disputeSchema = new Schema(
  {
    disputeId: {
      type: String,
      required: true,
    },
    seviceHiringId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceHiring",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    InitiatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Dispute", disputeSchema);
