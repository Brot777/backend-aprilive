import { model, Schema } from "mongoose";
import { ImageVerification } from "../interfaces/imageVerification";

const imageVerificationSchema = new Schema<ImageVerification>(
  {
    url: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    Key: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const imageVerificationModel = model("ImageVerification", imageVerificationSchema);
export { imageVerificationModel };
