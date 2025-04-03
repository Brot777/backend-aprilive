import { Schema } from "mongoose";

export interface CompanyAccount {
  _id: string;
  nameCompany: string;
  web: string;
  remote: boolean;
  address: string;
  addressVisible: boolean;
  sector: string;
  specialties: [];
  userId: Schema.Types.ObjectId;
  ownerId: Schema.Types.ObjectId;
  companyFoundation: Date | string;
  sizeOfCompany: string;
}
