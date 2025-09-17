import mongoose from "mongoose";
import { userModel } from "../models/user";
import personAccountModel from "../models/personAccount";
import avatarModel from "../models/avatar";
import accountTypeModel from "../models/accountType";
import presentationVideoModel from "../models/presentationVideo";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";
import { comparePassword, encryptPassword } from "../utils/bcrypt.handle";
import { transporter } from "../config/mail";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel
      .find({ isCompany: false })
      .select("-password");
    res.status(200).json(users);
  } catch (error) {
    handleHttp(res, "Error_Get_Users", error);
  }
};

export const deepLinkUserProfile = async (req: Request, res: Response) => {
  const { id, typeAccount } = req.query;
  try {
    // Validar si se recibieron los parámetros
    if (typeAccount == undefined || id == undefined) {
      return res.status(400).send("Missing parameters");
    }

    const deepLink = `aprilive://visitProfile/${typeAccount}/${id}`;
    // URL de la app en Play Store supuertamente
    /*  const playStoreUrl = `https://play.google.com/store/apps/details?id=com.aprilive`; */
    const playStoreUrl = `https://play.google.com/store/apps/details?id=com.supercell.clashroyale&hl=es_GT`;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Redirigiendo...</title>
        </head>
        <body>
          <script>
            // Intenta abrir la app
            window.location = "${deepLink}";
    
            // Si no se abre la app, redirige a Play Store después de 1.5 segundos
            setTimeout(() => {
              window.location = "${playStoreUrl}";
            }, 1500);
          </script>
        </body>
        </html>
      `);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "invalid user id" });
    }
    const user = await userModel
      .findById(userId)
      .select("-password")
      .populate("photoUrl", "url")
      .populate("videoUrl", "url")
      .populate("preferences")
      .populate({
        path: "networks",
        populate: {
          path: "network",
        },
      })
      .populate({
        path: "accountType",
        select: "role",
        populate: {
          path: "role",
          select: "name -_id",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "cv",
          select: "url",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "workExperience",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "education",
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "languages",
          populate: {
            path: "languaje",
          },
        },
      })
      .populate({
        path: "personAccount",
        populate: {
          path: "skills",
        },
      });
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  let { personAccount = {}, password, ...restUser } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user Id" });
    }
    const user = await userModel.findOne({ _id: userId, isCompany: false });

    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }
    await personAccountModel.findOneAndUpdate({ userId }, personAccount);
    const userUpdated = await userModel
      .findByIdAndUpdate(userId, restUser, {
        new: true,
      })
      .select("-password");

    res.status(200).json(userUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_User", error);
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ error: "404 not found" });
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "404 not found" });
    }
    const response = await userModel.findByIdAndDelete(userId);

    await personAccountModel.deleteOne({ userId });
    await avatarModel.deleteOne({ userId });
    await presentationVideoModel.deleteOne({ userId });
    await accountTypeModel.deleteOne({ userId });
    res.status(200).json(response);
  } catch (error) {
    handleHttp(res, "Error_Delete_User", error);
  }
};

export const updatePasswordByUserId = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;
  try {
    const userFound = await userModel.findOne({
      _id: userId,
      isCompany: false,
    });
    console.log(userFound);

    if (!userFound) {
      return res.status(404).json({ error: "404 user not found" });
    }
    const matchPassword = await comparePassword(
      oldPassword,
      userFound.password
    );

    if (!matchPassword) {
      return res.status(403).json({ error: "contraseña invalida" });
    }
    const hashPassword = await encryptPassword(newPassword);
    await userModel.findByIdAndUpdate(userId, { password: hashPassword });

    res.status(200).json({ msj: "password updated successfully" });
  } catch (error) {
    handleHttp(res, "Error_Update_Password", error);
  }
};

export const temporalUpdatePassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  try {
    const userFound = await userModel.findOne({
      email,
      isCompany: false,
    });
    console.log(userFound);

    if (!userFound) {
      return res.status(404).json({ error: "404 user not found" });
    }

    const hashPassword = await encryptPassword(newPassword);
    await userModel.findOneAndUpdate({ email }, { password: hashPassword });

    res.status(200).json({ msj: "password updated successfully" });
  } catch (error) {
    handleHttp(res, "Error_Update_Password", error);
  }
};

export const deepLinkChangePassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  console.log(token);

  try {
    // Validar si se recibieron los parámetros
    if (token == undefined) {
      return res.status(400).send("Missing parameters");
    }

    const deepLink = `aprilive://change-password/${token}`;
    // URL de la app en Play Store supuertamente
    /*  const playStoreUrl = `https://play.google.com/store/apps/details?id=com.aprilive`; */
    const playStoreUrl = `https://play.google.com/store/apps/details?id=com.supercell.clashroyale&hl=es_GT`;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Redirigiendo...</title>
        </head>
        <body>
          <script>
            // Intenta abrir la app
            window.location = "${deepLink}";
    
            // Si no se abre la app, redirige a Play Store después de 1.5 segundos
            setTimeout(() => {
              window.location = "${playStoreUrl}";
            }, 1500);
          </script>
        </body>
        </html>
      `);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};
export const deepLinkVerifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  console.log(token);

  try {
    // Validar si se recibieron los parámetros
    if (token == undefined) {
      return res.status(400).send("Missing parameters");
    }

    const deepLink = `aprilive://verify-email/${token}`;
    // URL de la app en Play Store supuertamente
    /*  const playStoreUrl = `https://play.google.com/store/apps/details?id=com.aprilive`; */
    const playStoreUrl = `https://play.google.com/store/apps/details?id=com.supercell.clashroyale&hl=es_GT`;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Redirigiendo...</title>
        </head>
        <body>
          <script>
            // Intenta abrir la app
            window.location = "${deepLink}";
    
            // Si no se abre la app, redirige a Play Store después de 1.5 segundos
            setTimeout(() => {
              window.location = "${playStoreUrl}";
            }, 1500);
          </script>
        </body>
        </html>
      `);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const { response, status } = await sendEmailResetPassword(
      email,
      transporter,
      "Recupera tu cuenta de Aprilive"
    );
    res.status(status).json(response);
  } catch (error) {
    handleHttp(res, "Something went wrong", error);
  }
};

export const recoverAccount = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { newPassword } = req.body;
  try {
    const hashPassword = await encryptPassword(newPassword);
    await userModel.findByIdAndUpdate(userId, { password: hashPassword });

    res.status(200).json({ msj: "password updated successfully" });
  } catch (error) {
    handleHttp(res, "Error_Update_Password", error);
  }
};
