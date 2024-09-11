import { Schema } from "mongoose";

export interface ImageService {
  _id: Schema.Types.ObjectId;
  url: string;
  name: string;
  Key: string;
}
