import mongoose, { model, Schema } from "mongoose";

const serviceHiringSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      default: mongoose.Types.ObjectId,
    },
    paymentId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "PENDING",
    },
    totalAmout: {
      type: String,
      default: "",
    },
    totalHours: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("ServiceHiring", serviceHiringSchema);
