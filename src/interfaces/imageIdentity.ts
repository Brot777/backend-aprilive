import { Schema } from "mongoose";

export interface ImageIdentity {
  _id: Schema.Types.ObjectId;
  url: string;
  name: string;
  Key: string;
}
