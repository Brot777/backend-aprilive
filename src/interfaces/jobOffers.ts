import { Schema } from "mongoose";
import { User } from "./user.interface";

export interface JobOffer {
  _id: Schema.Types.ObjectId;
  typePost: string;
  authorId: Schema.Types.ObjectId | User;
  isLike: boolean;
  isFavorite: boolean;
  numLikes: number;
  following: boolean;
  offerVideo: string;
  jobTitle: string;
  jobTitleNormalize: string;
  publisher: string;
  description: string;
  allowComments: boolean;
  commets: Schema.Types.ObjectId[];
  expirationDate: Date | string;
  typeJob: string;
  typeContract: string;
  typeLocationWorking: string;
  allowedCountries: [];
  address: string;
  jobSkills: [];
  benefits: [];
  hashtags: [];
  WhoCanSee: string;
  remuneration: Schema.Types.Mixed;
  languages: [];
  sharedLink: string;
  responsibilities: [];
  levelOfCompetence: string;
}
