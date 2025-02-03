import { model, Schema } from "mongoose";

const userNetworkSchema = new Schema(
  {
    network: {
      type: Schema.Types.ObjectId,
      ref: "Network",
      required: true,
    },
    link: {
      type: String,
      default: "",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("UserNetwork", userNetworkSchema);
