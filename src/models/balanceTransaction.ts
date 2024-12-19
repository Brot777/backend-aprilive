import { model, Schema } from "mongoose";

const balanceTransactionSchema = new Schema(
  {
    amunt: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
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
  }
);

export default model("BalanceTransaction", balanceTransactionSchema);
