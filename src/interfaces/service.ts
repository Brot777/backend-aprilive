import { Schema } from "mongoose";
import { User } from "./user.interface";
import { ImageService } from "./imageService";
import { Category } from "./category";
export interface Service {
  _id: Schema.Types.ObjectId;
  typePost: string;
  authorId: Schema.Types.ObjectId | User;
  isLike: boolean;
  numLikes: number;
  following: boolean;
  title: string;
  categories: Schema.Types.ObjectId[] | Category[];
  description: string;
  allowComments: boolean;
  video: Schema.Types.ObjectId;
  images: Schema.Types.ObjectId[] | ImageService[];
  price: string;
  money: string;
  wayToPay: string;
  deliberyTime: string;
  quantity: number;
  hashtags: [];
  contratame: string;
  serviceDetails: string[];
  WhoCanSee: string;
}
