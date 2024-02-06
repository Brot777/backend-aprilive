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
  categories: string[];
  description: string;
  allowComments: boolean;
  video: Schema.Types.ObjectId;
  images: Schema.Types.ObjectId[];
  price: string;
  money: string;
  wayToPay: string;
  deliberyTime: string;
  contratame: string;
  serviceDetails: string[];
}
