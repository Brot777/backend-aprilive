import { model, Schema } from "mongoose";

const portfolioSchema = new Schema(
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
      // este solo va con el portafolio o tambien en el servicio
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
      ref: "videoService",
    },

    images: {
      type: [{ type: Schema.Types.ObjectId, ref: "imageService" }],
      default: [],
    },

    externalWebsite: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Portfolio", portfolioSchema);
