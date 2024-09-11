import { model, Schema } from "mongoose";
import { ImageService } from "../interfaces/imageService";

const imageServiceSchema = new Schema<ImageService>(
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
  }
);

export default model("ImageService", imageServiceSchema);
