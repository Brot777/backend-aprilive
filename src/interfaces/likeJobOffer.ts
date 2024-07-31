import { Schema } from "mongoose";

export interface LikeJobOffer {
  _id: Schema.Types.ObjectId;
  userId: string | Schema.Types.ObjectId;
  jobOfferId: string | Schema.Types.ObjectId;
}
