import mongoose, { model, Schema } from "mongoose";
import { PersonAccount } from "../interfaces/personAccount";

const personAccountSchema = new Schema<PersonAccount>(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    proEmail: {
      type: String,
      default: "",
    },
    proEmailVisible: {
      type: Boolean,
      default: true,
    },
    sex: {
      type: String,
      default: "",
    },
    sexVisible: {
      type: Boolean,
      default: true,
    },

    compensation: {
      type: Schema.Types.Mixed,
      default: {
        type: "",
        payment_currency: "",
        payment_amount_min: 0,
        payment_amount_max: 0,
        payment_date: "",
      },
    },

    birthday: {
      type: Date,
      default: new Date(),
    },

    workExperience: {
      type: [{ type: Schema.Types.ObjectId, ref: "WorkExperience" }],
      default: [],
    },

    education: {
      type: [{ type: Schema.Types.ObjectId, ref: "Education" }],
      default: [],
    },
    languages: {
      type: [{ type: Schema.Types.ObjectId, ref: "UserLanguaje" }],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cv: {
      type: Schema.Types.ObjectId,
      ref: "Cv",
      default: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default model("PersonAccount", personAccountSchema);
