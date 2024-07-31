import { Schema } from "mongoose";

export interface LikeService {
  _id: Schema.Types.ObjectId;
  userId: string | Schema.Types.ObjectId;
  serviceId: string | Schema.Types.ObjectId;
}
