import { model, Schema } from "mongoose";

const withdrawalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pendiente", "completado", "fallido"],
      default: "pendiente",
    },
    transactionId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("WithdrawalHiring", withdrawalSchema);
