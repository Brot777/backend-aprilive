import { model, Schema } from "mongoose";

const quoteSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    estimatedDeliveryDate: {
      type: Date,
      default: "",
      require: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Quote", quoteSchema);
