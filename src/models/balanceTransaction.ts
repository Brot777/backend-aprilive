import { model, Schema } from "mongoose";

const balanceTransactionSchema = new Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    increase: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    paymentId: {
      type: String,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("BalanceTransaction", balanceTransactionSchema);
