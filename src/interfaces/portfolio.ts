import { Schema } from "mongoose";
import { User } from "./user.interface";
import { ImagePortfolio } from "./imagePortfolio";
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
  characteristics: string[];
  hashtags: string[];
  video: Schema.Types.ObjectId;
  images: Schema.Types.ObjectId[] | ImagePortfolio[];
  externalWebsite: string;
  portfolioDetails: string[];
}
