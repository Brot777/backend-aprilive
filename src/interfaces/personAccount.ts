import { Schema } from "mongoose";

export interface Compensation {
  _id: string;
  typeCompensation: string;
  payment_currency: string;
  payment_amount_min: number;
  payment_amount_max: number;
  payment_date: string;
  visible: boolean;
}
export interface Oauth2 {
  googleId: string;
}

export interface PersonAccount {
  _id: string;
  firstName: string;
  lastName: string;
  proEmail: string;
  proEmailVisible: boolean;
  sex: string;
  sexVisible: boolean;
  compensation: Compensation;
  dateOfBirth: Date;
  workExperience: Schema.Types.ObjectId[];
  education: Schema.Types.ObjectId[];
  languages: Schema.Types.ObjectId[];
  skills: Schema.Types.ObjectId[];
  cv: Schema.Types.ObjectId;
  cvVisible: boolean;
  userId: Schema.Types.ObjectId;
  oauth2: Oauth2;
}
