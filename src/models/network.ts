import { model, Schema } from "mongoose";

const networkSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Network", networkSchema);
