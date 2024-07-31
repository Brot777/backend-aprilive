import { model, Schema } from "mongoose";
import { LikeService } from "../interfaces/likeService";

const likeServiceSchema = new Schema<LikeService>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("LikeService", likeServiceSchema);
