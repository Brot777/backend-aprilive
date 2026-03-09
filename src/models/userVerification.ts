import { model, Schema } from "mongoose";

const userVerificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status:{
      type:String,
      enum: ["sin verificar","pendiente", "verificado"],
      default:"sin verificar"
    }
    images: {
      type: [{ type: Schema.Types.ObjectId, ref: "ImageIdentity" }],
      default: [],
    },
  },
  {
    versionKey: false,
  },
);

const userVerificationModel = model("UserVerification", userVerificationSchema);

export { userVerificationModel };
