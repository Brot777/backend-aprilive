import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import companyAccountModel from "../models/companyAccount";
import userModel from "../models/user";
import avatarModel from "../models/avatar";
import presentationVideoModel from "../models/presentationVideo";
import roleModel from "../models/role";
import accountTypeModel from "../models/accountType";
import { CompanyAccount } from "../interfaces/companyAccount";

export const createCompany = async (req: Request, res: Response) => {
  const userId = req.userId;
  let { companyAccount = {}, ...restCompanyUser } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    const ownerUser = await userModel
      .findById(userId)
      .populate("personAccount");
    if (!ownerUser) {
      return res.status(404).json({ error: "404 user not found" });
    }

    // add existing password
    restCompanyUser.password = ownerUser?.password;

    //create company user
    const companyUserSaved = await userModel.create(restCompanyUser);
    companyAccount.userId = companyUserSaved?._id;
    companyAccount.ownerId = ownerUser._id;

    //create company account
    const companyAccountSaved = await companyAccountModel.create(
      companyAccount
    );

    const avatarSaved = await avatarModel.create({
      userId: companyUserSaved._id,
    });
    const presentationVideoSaved = await presentationVideoModel.create({
      userId: companyUserSaved._id,
    });

    const freeCompanyRole = await roleModel.findOne({
      name: "Free Company",
    });

    const accountTypeSaved = await accountTypeModel.create({
      userId: companyUserSaved._id,
      role: freeCompanyRole?._id,
    });

    //update companyUserSaved
    await userModel.findByIdAndUpdate(companyUserSaved._id, {
      photoUrl: avatarSaved._id,
      videoUrl: presentationVideoSaved._id,
      companyAccount: companyAccountSaved._id,
      accountType: accountTypeSaved._id,
      isCompany: true,
    });

    //Token
    const token = jwt.sign(
      { _id: companyUserSaved._id },
      process.env.SECRET || ""
    );
    return res.status(200).json({
      _id: companyUserSaved._id,
      username: companyUserSaved.username,
      token,
      isCompany: true,
    });
  } catch (error) {
    handleHttp(res, "Error_Create_Company", error);
  }
};

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companyUsers = await userModel.find({ isCompany: true });
    res.status(200).json(companyUsers);
  } catch (error) {
    handleHttp(res, "Error_Get_Companies", error);
  }
};

export const getCompanyProfileById = async (req: Request, res: Response) => {
  const companyUserId = req.params.companyUserId;
  try {
    if (!mongoose.Types.ObjectId.isValid(companyUserId)) {
      return res.status(400).json({ error: "invalid company id" });
    }
    const companyUser = await userModel
      .findById(companyUserId)
      .populate("photoUrl", "url")
      .populate("videoUrl", "url")
      .populate("preferences")
      .populate("companyAccount")
      .populate({
        path: "accountType",
        select: "role",
        populate: {
          path: "role",
          select: "name -_id",
        },
      });
    if (!companyUser) {
      return res.status(404).json({ error: "404 company not found" });
    }

    res.status(200).json(companyUser);
  } catch (error) {
    handleHttp(res, "Error_Get_User", error);
  }
};

export const updatecompanyById = async (req: Request, res: Response) => {
  const companyUserId = req.params.companyUserId;
  let { companyAccount = {}, ...restCompanyUser } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(companyUserId)) {
      return res.status(400).json({ error: "Invalid company Id" });
    }
    const companyUser = await userModel.findOne({ _id: companyUserId });
    if (!companyUser) {
      return res.status(404).json({ error: "404 company not found" });
    }
    await companyAccountModel.findOneAndUpdate(
      { userId: companyUserId },
      companyAccount
    );
    const companyUserUpdated = await userModel
      .findByIdAndUpdate(companyUserId, restCompanyUser, {
        new: true,
      })
      .populate("companyAccount");
    res.status(200).json(companyUserUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Company", error);
  }
};

export const deleteCompanyById = async (req: Request, res: Response) => {
  const companyUserId = req.params.companyUserId;
  try {
    if (!mongoose.Types.ObjectId.isValid(companyUserId)) {
      return res.status(400).json({ error: "invalid company user id" });
    }

    const companyUser = await userModel.findById(companyUserId);

    if (!companyUser) {
      return res.status(404).json({ error: "404 company not found" });
    }

    const response = await userModel.findByIdAndDelete(companyUserId);
    await companyAccountModel.deleteOne({ userId: companyUserId });
    await avatarModel.deleteOne({ userId: companyUserId });
    await presentationVideoModel.deleteOne({ userId: companyUserId });
    await accountTypeModel.deleteOne({ userId: companyUserId });

    res.status(200).json(response);
  } catch (error) {
    handleHttp(res, "Error_Delete_User", error);
  }
};

export const switchToCompanyAccountById = async (
  req: Request,
  res: Response
) => {
  const companyUserId = req.params.companyUserId;
  const userId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(companyUserId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const companyUser = await userModel
      .findById(companyUserId)
      .populate("companyAccount");
    if (!companyUser) {
      return res.status(404).json({ error: "404 company not found" });
    }

    const companyAccount = companyUser.companyAccount as CompanyAccount;

    const isMyCompany = userId == companyAccount.ownerId.toString();

    if (!isMyCompany) {
      return res
        .status(401)
        .json({ error: "you do not have access to this company" });
    }

    //Token
    const token = jwt.sign({ _id: companyUserId }, process.env.SECRET || "");
    return res.status(200).json({
      _id: companyUser._id,
      username: companyUser.username,
      token,
      isCompany: true,
    });
  } catch (error) {
    handleHttp(res, "Error_Switch_User_To_Company", error);
  }
};

export const switchToOwnerAccount = async (req: Request, res: Response) => {
  const companyUserId = req.userId;
  try {
    const companyUser = await userModel
      .findById(companyUserId)
      .populate("companyAccount");

    const companyAccount = companyUser?.companyAccount as CompanyAccount;
    const ownerUser = await userModel.findById(companyAccount.ownerId);

    //Token
    const token = jwt.sign({ _id: ownerUser?._id }, process.env.SECRET || "");
    return res.status(200).json({
      _id: ownerUser?._id,
      username: ownerUser?.username,
      token,
      isCompany: false,
    });
  } catch (error) {
    handleHttp(res, "Error_Switch_Company_To_User", error);
  }
};
