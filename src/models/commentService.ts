import { model, Schema } from "mongoose";

const commentServiceSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },

    authorId: {
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
export default model("commentService", commentServiceSchema);
