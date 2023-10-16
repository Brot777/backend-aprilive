import { Schema } from "mongoose";

export interface LikeJobOffer {
  _id: Schema.Types.ObjectId;
  userId: string;
  jobOfferId: string;
}
