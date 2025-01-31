import { model, Schema } from "mongoose";

const conflictSchema = new Schema(
  {
    token: {
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
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Conflict", conflictSchema);
