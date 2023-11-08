import { Schema } from "mongoose";
import { Avatar } from "./avatar.interface";
import { PersonAccount } from "./personAccount";
import { CompanyAccount } from "./companyAccount";

export interface User {
  _id: Schema.Types.ObjectId;
  /* firstName: string;
  lastName: string; */
  accountType: Schema.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  photoUrl: Schema.Types.ObjectId | Avatar;
  profileUrl: string;
  videoUrl: Schema.Types.ObjectId;
  proTitle: string;
  proTitleVisible: boolean;
  /* proEmail: string;
  proEmailVisible: boolean; */
  phoneArea: string;
  phone: string;
  phoneVisible: boolean;
  /*  sex: string;
  sexVisible: boolean; */
  country: string;
  provinceDepartmentState: string;
  cityId: string;
  /* compensation: Schema.Types.Mixed; */
  status: string;
  /* birthday: Date; */
  about: string;
  numberFollowers: number;
  numberFollowing: number;
  views: number;
  preferences: Schema.Types.ObjectId[];
  networks: Schema.Types.ObjectId[];
  networkMore: Schema.Types.ObjectId[];
  /* workExperience: Schema.Types.ObjectId[];
  education: Schema.Types.ObjectId[];
  languages: Schema.Types.ObjectId[];
  myCompanies: Schema.Types.ObjectId[]; */
  personAccount: Schema.Types.ObjectId | PersonAccount;
  companyAccount: Schema.Types.ObjectId | CompanyAccount;
  isCompany: boolean;
}

export type RegisterUser = Omit<
  User,
  | "_id"
  | "accountType"
  | "name"
  | "firstName"
  | "lastName"
  | "photoUrl"
  | "profileUrl"
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
  | "personAccount"
  | "companyAccount"
  | "isCompany"
>;

export type LoginUser = Omit<RegisterUser, "username">;
