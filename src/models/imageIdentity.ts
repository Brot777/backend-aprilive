import { model, Schema } from "mongoose";
import { ImageIdentity } from "../interfaces/imageIdentity";

const imageIdentitySchema = new Schema<ImageIdentity>(
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

const imageIdentityModel = model("ImageIdentity", imageIdentitySchema);
export { imageIdentityModel };
