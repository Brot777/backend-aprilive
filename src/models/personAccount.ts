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
      typeCompensation: {
        type: String,
        default: "",
      },
      payment_currency: {
        type: String,
        default: "",
      },
      payment_amount_min: {
        type: Number,
        default: 0,
      },
      payment_amount_max: {
        type: Number,
        default: 0,
      },
      payment_date: {
        type: String,
        default: "",
      },
      visible: {
        type: Boolean,
        default: true,
      },
    },

    dateOfBirth: {
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
    skills: {
      type: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
      default: [], //array de referencias de id {id, value}
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
