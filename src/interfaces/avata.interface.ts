import { Schema } from "mongoose";

export interface Avatar {
  url: string;
  name: string;
  userid: Schema.Types.ObjectId;
}
