import { model, Schema } from "mongoose";

const avatarSchema = new Schema(
  {
    url: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    userid: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Avatar", avatarSchema);
