import { model, Schema } from "mongoose";

const networkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Network", networkSchema);
