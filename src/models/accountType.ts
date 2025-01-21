import mongoose, { model, Schema } from "mongoose";

const accountTypeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("AccountType", accountTypeSchema);
