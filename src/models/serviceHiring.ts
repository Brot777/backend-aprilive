import mongoose, { model, Schema } from "mongoose";
import { ServiceHiring } from "../interfaces/serviceHiring";

const serviceHiringSchema = new Schema<ServiceHiring>(
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
      enum: ["pendiente", "completado", "reembolsado"],
      default: "pendiente",
    },
    totalAmount: {
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
