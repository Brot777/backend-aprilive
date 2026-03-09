import { model, Schema } from "mongoose";

const identitySchema = new Schema(
  {
    userVerificationId: {
      type: Schema.Types.ObjectId,
      ref: "UserVerification",
      required: true,
    },
    images: {
      type: [{ type: Schema.Types.ObjectId, ref: "ImageIdentity" }],
      default: [],
    },
  },
  {
    versionKey: false,
  },
);

const identityModel = model("Identity", identitySchema);

export { identityModel };
