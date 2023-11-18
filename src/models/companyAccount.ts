import { model, Schema } from "mongoose";
import { CompanyAccount } from "../interfaces/companyAccount";

const companyAccountSchema = new Schema<CompanyAccount>(
  {
    nameCompany: {
      type: String,
      default: "",
    },

    web: {
      type: String,
      default: "",
    },
    remote: {
      type: Boolean,
      default: true,
    },

    address: {
      type: String,
      default: "",
    },
    sector: {
      type: String,
      default: "",
    },

    specialties: {
      type: [],
      default: [],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyFoundation: {
      type: Date,
      default: "",
    },
    sizeOfCompany: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default model("CompanyAccount", companyAccountSchema);
