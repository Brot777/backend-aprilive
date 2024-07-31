import { Schema } from "mongoose";

export interface LikePortfolio {
  _id: Schema.Types.ObjectId;
  userId: string | Schema.Types.ObjectId;
  portfolioId: string | Schema.Types.ObjectId;
}
