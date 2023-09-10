import { model, Schema } from "mongoose";

const avatarSchema = new Schema(
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

export default model("Avatar", avatarSchema);
