import { model, Schema } from "mongoose";
import { JobOffer } from "../interfaces/jobOffers";

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

    skills: {
      type: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
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
    typeRemuneration: {
      type: String,
      default: "",
    },
    minSalary: {
      type: String,
      default: "",
    },
    maxSalary: {
      type: String,
      default: "",
    },
    timeRemuneration: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "",
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
    status: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobOfferSchema.index({ jobTitle: "text", description: "text" });

export default model("JobOffer", jobOfferSchema);
