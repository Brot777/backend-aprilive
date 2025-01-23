import { Schema } from "mongoose";

export interface AccoutType {
  url: string;
  name: string;
  userId: Schema.Types.ObjectId;
}
