import { Schema } from "mongoose";

export interface PersonAccount {
  _id: string;
  firstName: string;
  lastName: string;
  proEmail: string;
  proEmailVisible: boolean;
  sex: string;
  sexVisible: boolean;
  compensation: Schema.Types.Mixed;
  birthday: Date;
  workExperience: Schema.Types.ObjectId[];
  education: Schema.Types.ObjectId[];
  languages: Schema.Types.ObjectId[];
  skills: Schema.Types.ObjectId[];
  cv: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}
