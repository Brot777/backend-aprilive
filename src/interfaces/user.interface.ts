import { Schema } from "mongoose";
import { Avatar } from "./avatar.interface";
import { PersonAccount } from "./personAccount";
import { CompanyAccount } from "./companyAccount";

export interface User {
  _id: Schema.Types.ObjectId;
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
  phoneArea: string;
  phone: string;
  phoneVisible: boolean;
  country: string;
  provinceDepartmentState: string;
  cityId: string;
  status: string;
  about: string;
  views: number;
  preferences: Schema.Types.ObjectId[];
  networks: Schema.Types.ObjectId[];
  networkMore: Schema.Types.ObjectId[];
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
