import { Schema } from "mongoose";

export interface ImagePortfolio {
  _id: Schema.Types.ObjectId;
  url: string;
  name: string;
  key: string;
}
