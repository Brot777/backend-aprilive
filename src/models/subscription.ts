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
    endedAt: {
      type: Date,
      default: new Date(),
    },
    startedAt: {
      type: Date,
      default: new Date(),
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    versionKey: false,
  }
);

export default model("User", userSchema);
