import mongoose, { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
   title:{
    type:String,
    default:"",
   },
   description:{
    type: String,
    default:"",
   },
   type:{
    type:String,
    default:"",
   },
   receiverId:{
    type: Schema.Types.ObjectId,
    ref:"User",
    require: true,
   }
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default model("Notification", notificationSchema);
