import mongoose, { model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceHiringId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceHiring",
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Review", reviewSchema);
