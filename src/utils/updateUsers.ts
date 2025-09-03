import { userModel } from "../models/user";

export const uptdateEmailToObject = async () => {
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
    console.log("error update many emails string to object");
  }
};
