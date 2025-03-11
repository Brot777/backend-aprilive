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
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      default: "",
      required: true,
    },
    sellerAccept:{ 
      type: Boolean,
      default: null}
  },
  {
    versionKey: false,
  }
);

export default model("Dispute", disputeSchema);
