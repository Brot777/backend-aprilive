import { model, Schema } from "mongoose";

const jobOfferSchema = new Schema(
  {
    typePost: {
      type: String,
      default: "",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* employment information */
    offerVideo: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
      required: true,
    },

    /* publicador */
    description: {
      type: String,
      default: "",
      required: true,
    },

    allowComments: {
      type: Boolean,
      default: true,
    },

    typeJob: {
      type: String,
      default: "",
      required: true,
    },

    typeContract: {
      type: String,
      default: "",
      required: true,
    },

    typeLocationWorking: {
      type: String,
      default: "",
      required: true,
    },

    allowedCountries: {
      type: [],
      default: [],
    },

    address: {
      type: String,
      default: "",
    },

    jobSkills: {
      type: [],
      default: [],
    },

    benefits: {
      type: [],
      default: [],
    },

    hashtags: {
      type: [],
      default: [],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("JobOffer", jobOfferSchema);
