import mongoose, { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    read: {
      type: Boolean,
      default: false,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default model("Notification", notificationSchema);
