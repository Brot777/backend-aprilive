import { model, Schema } from "mongoose";

const skillSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Skill", skillSchema);
