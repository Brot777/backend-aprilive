import { model, Schema } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Company", companySchema);