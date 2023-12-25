import { model, Schema } from "mongoose";
import { Service } from "../interfaces/service";

const serviceSchema = new Schema<Service>(
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

    categories: {
      type: [{ type: String }],
      default: [],
    },

    description: {
      type: String,
      default: "",
      required: true,
    },

    numLikes: {
      type: Number,
      default: 0,
    },

    allowComments: {
      type: Boolean,
      default: true,
    },

    video: {
      type: Schema.Types.ObjectId,
      ref: "VideoService",
    },

    images: {
      type: [{ type: Schema.Types.ObjectId, ref: "ImageService" }],
      default: [],
    },

    price: {
      type: String,
      default: "",
    },

    deliberyTime: {
      type: String,
      default: "",
    },

    contratame: {
      type: Boolean,
      default: false,
    },

    contratanos: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Service", serviceSchema);
