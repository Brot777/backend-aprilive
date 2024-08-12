import { Schema } from "mongoose";

export interface LikeService {
  _id: Schema.Types.ObjectId;
  userId: string;
  serviceId: string;
}
