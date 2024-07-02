import { model, Schema } from "mongoose";
import { JobOffer } from "../interfaces/jobOffers";
import { convertTitleNormalize } from "../services/jobOffer";

const jobOfferSchema = new Schema<JobOffer>(
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

    isFavorite: {
      type: Boolean,
      default: false,
    },
    isLike: {
      type: Boolean,
      default: false,
    },

    numLikes: {
      type: Number,
      default: 0,
    },

    following: {
      type: Boolean,
      default: false,
    },

    offerVideo: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
      required: true,
    },

    jobTitleNormalize: {
      type: String,
      default: "",
      required: true,
    },

    publisher: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      required: true,
    },

    allowComments: {
      type: Boolean,
      default: true,
    },

    expirationDate: {
      type: Date,
      default: "",
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
    WhoCanSee: {
      type: String,
      default: "",
    },
    remuneration: {
      type: Schema.Types.Mixed,
      default: {
        type: "",
        salary: "",
        time: "",
        money: "",
      },
    },
    languages: {
      type: [],
      default: [],
    },

    sharedLink: {
      type: String,
      default: "",
    },

    responsibilities: {
      type: [{ type: String }],
      default: [],
    },

    levelOfCompetence: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobOfferSchema.index({ jobTitle: "text" });

export default model("JobOffer", jobOfferSchema);
