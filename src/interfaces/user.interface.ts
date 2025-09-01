import { Schema } from "mongoose";
import { Avatar } from "./avatar.interface";
import { PersonAccount } from "./personAccount";
import { CompanyAccount } from "./companyAccount";
import { CountryStateCity } from "./country";

export interface User {
  _id: Schema.Types.ObjectId;
  accountType: Schema.Types.ObjectId;
  name: string;
  username: string;
  password: string;
  email: Email;
  emailVisible: boolean;
  photoUrl: Schema.Types.ObjectId | Avatar;
  profileUrl: string;
  videoUrl: Schema.Types.ObjectId;
  proTitle: string;
  proTitleVisible: boolean;
  phoneArea: string;
  phone: string;
  phoneVisible: boolean;
  country: CountryStateCity;
  provinceDepartmentState: CountryStateCity;
  city: CountryStateCity;
  status: string;
  about: string;
  preferences: Schema.Types.ObjectId[];
  networks: Schema.Types.ObjectId[];
  networkMore: string[];
  personAccount: Schema.Types.ObjectId | PersonAccount;
  companyAccount: Schema.Types.ObjectId | CompanyAccount;
  isCompany: boolean;
}

export type RegisterUser = Omit<
  User,
  | "_id"
  | "accountType"
  | "name"
  | "emailVisible"
  | "photoUrl"
  | "profileUrl"
  | "videoUrl"
  | "proTitle"
  | "proTitleVisible"
  | "phoneArea"
  | "phone"
  | "phoneVisible"
  | "country"
  | "provinceDepartmentState"
  | "city"
  | "status"
  | "about"
  | "preferences"
  | "networks"
  | "networkMore"
  | "personAccount"
  | "companyAccount"
  | "isCompany"
>;

export interface Email {
  value: string;
  emailVisible: boolean;
  verified: boolean;
}

export type LoginUser = Omit<RegisterUser, "username">;
