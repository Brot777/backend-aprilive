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
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
      require: true,
    },
    updatedAt: {
      type: Date,
      default: new Date(),
      require: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("User", userSchema);
