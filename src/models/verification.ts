import { model, Schema } from "mongoose";

const verificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status:{
      type:String,
      enum: ["sin verificar","pendiente", "verificado","rechazado"],
      default:"sin verificar"
    },
    images: {
      type: [{ type: Schema.Types.ObjectId, ref: "ImageVerification" }],
      default: [],
    },
     rejectionReason:{
      type:String,
      default:""
     }
  },
  {
    versionKey: false,
    timestamps:true,
  },
);

const verificationModel = model("verification", verificationSchema);

export { verificationModel };
