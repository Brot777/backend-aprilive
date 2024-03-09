import { model, Schema } from "mongoose";

const workExperienceSchema = new Schema(
  {
    companyName: {
      type: String,
      default: "",
      required: true,
    },
    occupation: {
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

export default model("WorkExperience", workExperienceSchema);
