import { Schema } from "mongoose";
import { User } from "./user.interface";
export interface Service {
  _id: Schema.Types.ObjectId;
  typePost: string;
  authorId: Schema.Types.ObjectId | User;
  isLike: boolean;
  numLikes: number;
  following: boolean;
  title: string;
  categories: String[];
  description: string;
  allowComments: boolean;
  video: Schema.Types.ObjectId;
  images: Schema.Types.ObjectId[];
  price: String;
  deliberyTime: String;
  contratame: Boolean;
  contratanos: Boolean;
}
