import { Schema } from "mongoose";
import { User } from "./user.interface";
import { Service } from "./service";
export interface ServiceHiring {
  _id: Schema.Types.ObjectId;
  serviceId: Schema.Types.ObjectId | Service;
  customerId: Schema.Types.ObjectId | User;
  reviewId: Schema.Types.ObjectId;
  paymentId: string;
  status: string;
  totalAmount: string;
  netAmount: string;
  totalHours: string;
  estimatedDeliveryDate: Date;
}
