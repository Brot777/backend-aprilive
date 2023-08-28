import { Schema } from "mongoose";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  photoUrl: string;
  profileUrl: string;
  accountType: string;
  videoUrl: string;
  dataTitular: Schema.Types.Mixed;
  status: boolean;
  birthday: Date;
  about: string;
  numberFollowers: number;
  numberFollowing: number;
  views: number;
  preferences: Schema.Types.ObjectId[];
  networks: Schema.Types.ObjectId[];
  networkMore: Schema.Types.ObjectId[];
  workExperience: Schema.Types.ObjectId[];
  education: Schema.Types.ObjectId[];
  languages: Schema.Types.ObjectId[];
  myCompanies: Schema.Types.ObjectId[];
}

export type RegisterUser = Omit<
  User,
  | "firstName"
  | "lastName"
  | "photoUrl"
  | "profileUrl"
  | "accountType"
  | "videoUrl"
  | "dataTitular"
  | "status"
  | "birthday"
  | "about"
  | "numberFollowers"
  | "numberFollowing"
  | "views"
  | "preferences"
  | "networks"
  | "networkMore"
  | "workExperience"
  | "education"
  | "languages"
  | "myCompanies"
>;

export type LoginUser = Omit<RegisterUser, "email">;
