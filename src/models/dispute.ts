import { model, Schema } from "mongoose";

const disputeSchema = new Schema(
  {
    order: {
      type: String,
      required: true,
    },
    seviceHiring: {
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
  },
  {
    versionKey: false,
  }
);

export default model("Dispute", disputeSchema);
