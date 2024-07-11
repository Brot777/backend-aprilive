import { model, Schema } from "mongoose";
import { Portfolio } from "../interfaces/portfolio";

const portfolioSchema = new Schema<Portfolio>(
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
    sharedLink: {
      type: String,
      default: "",
    },
    isLike: {
      type: Boolean,
      default: false,
    },
    following: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
      required: true,
    },
    description: {
      type: String,
      default: "",
      required: true,
    },
    characteristics: {
      type: [{ type: String }],
      default: [],
    },
    hashtags: {
      type: [{ type: String }],
      default: [],
    },
    numLikes: {
      type: Number,
      default: 0,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "VideoPortfolio",
    },
    images: {
      type: [{ type: Schema.Types.ObjectId, ref: "ImagePortfolio" }],
      default: [],
    },
    externalWebsite: {
      type: String,
      default: "",
    },
    portfolioDetails: {
      type: [{ type: String }],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
portfolioSchema.index({ title: "text", description: "text" });

export default model("Portfolio", portfolioSchema);
