import { Schema } from "mongoose";

export interface Avatar {
  url: string;
  name: string;
  userId: Schema.Types.ObjectId;
}
