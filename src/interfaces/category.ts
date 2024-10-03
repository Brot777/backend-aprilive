import { Schema } from "mongoose";

export interface Category {
  _id: Schema.Types.ObjectId;
  value: string;
}
