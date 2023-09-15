import { model, Schema } from "mongoose";

const presentationVideoSchema = new Schema(
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

export default model("PresentationVideo", presentationVideoSchema);
