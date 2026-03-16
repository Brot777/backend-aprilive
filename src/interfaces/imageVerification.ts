import { Schema } from "mongoose";

export interface ImageVerification {
  _id: Schema.Types.ObjectId;
  url: string;
  name: string;
  Key: string;
}
