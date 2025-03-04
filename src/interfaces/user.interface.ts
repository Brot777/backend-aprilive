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
  | "city"
  | "compensation"
  | "status"
  | "birthday"
  | "about"
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
