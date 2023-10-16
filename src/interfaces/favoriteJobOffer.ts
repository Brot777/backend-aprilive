import { Schema } from "mongoose";

export interface FavoriteJobOffer {
  _id: Schema.Types.ObjectId;
  userId: string;
  jobOfferId: string;
}
