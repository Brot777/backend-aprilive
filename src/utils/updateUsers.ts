import { Request, Response } from "express";
import { handleHttp } from "./error.handle";
import { userModel } from "../models/user";

const uptdateEmailToObject = async (req: Request, res: Response) => {
  try {
    await userModel.updateMany({}, [
      {
        $set: {
          email: {
            value: "$email",
            verified: false,
            emailVisible: "$emailVisible",
          },
        },
      },
      { $unset: "emailVisible" },
    ]);
  } catch (error) {
    handleHttp(res, "Error Update Many Email Users", error);
  }
};
