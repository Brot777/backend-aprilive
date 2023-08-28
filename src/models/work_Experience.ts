import { model, Schema } from "mongoose";

const workExperienceSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    ocupation: {
      type: String,
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("WorkExperience", workExperienceSchema);
