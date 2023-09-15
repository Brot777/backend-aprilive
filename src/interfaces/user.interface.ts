import { Schema } from "mongoose";
import { Avatar } from "./avata.interface";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  photoUrl: Schema.Types.ObjectId | Avatar;
  profileUrl: string;
  accountType: string;
  videoUrl: Schema.Types.ObjectId;
  proTitle: string;
  proTitleVisible: boolean;
  proEmail: string;
  proEmailVisible: boolean;
  phoneArea: string;
  phone: string;
  phoneVisible: boolean;
  sex: string;
  sexVisible: boolean;
  country: string;
  provinceDepartmentState: string;
  cityId: string;
  compensation: Schema.Types.Mixed;
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
  | "proTitle"
  | "proTitleVisible"
  | "proEmail"
  | "proEmailVisible"
  | "phoneArea"
  | "phone"
  | "phoneVisible"
  | "sex"
  | "sexVisible"
  | "country"
  | "provinceDepartmentState"
  | "cityId"
  | "compensation"
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

export type LoginUser = Omit<RegisterUser, "username">;
