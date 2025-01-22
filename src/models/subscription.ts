import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    reference: {
      type: String,
      default: "",
    },
    finishAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    renewal: {
      type: Boolean,
      default: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("User", userSchema);
