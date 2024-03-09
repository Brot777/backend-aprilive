import { model, Schema } from "mongoose";

const educationSchema = new Schema(
  {
    titleEducation: {
      type: String,
      default: "",
      required: true,
    },
    institution: {
      type: String,
      default: "",
      required: true,
    },
    dateStart: {
      type: Date,
      default: "",
      required: true,
    },
    dateEnd: {
      type: Date,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Education", educationSchema);
