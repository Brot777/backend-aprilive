import { Schema } from "mongoose";

export interface LikePortfolio {
  _id: Schema.Types.ObjectId;
  userId: string;
  portfolioId: string;
}
