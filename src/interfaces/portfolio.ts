import { Schema } from "mongoose";
import { User } from "./user.interface";
export interface Portfolio {
  _id: Schema.Types.ObjectId;
  typePost: string;
  authorId: Schema.Types.ObjectId | User;
  sharedLink: string;
  isLike: boolean;
  numLikes: number;
  following: boolean;
  title: string;
  description: string;
  characteristics: String[];
  hashtags: String[];
  video: Schema.Types.ObjectId;
  images: Schema.Types.ObjectId[];
  externalWebsite: String;
}
