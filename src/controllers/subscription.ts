import { Request, Response } from "express";
import subscriptionModel from "../models/subscription";
import mongoose from "mongoose";
import { handleHttp } from "../utils/error.handle";
import axios from "axios";
import { PAYPAL_API } from "../config/paypal";
import { getPayPalToken } from "../utils/paypal";
import roleModel from "../models/role";
import accountTypeModel from "../models/accountType";

export const getMySubscriptions = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "invalid user id" });
  }
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const subscriptions = await subscriptionModel
      .find({ userId })
      .skip((page - 1) * limit)
      .limit(limit);

    let totalDocs = await subscriptionModel.count({ userId }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: subscriptions,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Subscriptions_By_UserId", error);
  }
};

export const cancelSubcriptionById = async (req: Request, res: Response) => {
  const subcriptionId = req.params.subcriptionId;
  const userId = req.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(subcriptionId)) {
      return res.status(400).json({ error: "invalid subcription id" });
    }
    const subcription = await subscriptionModel.findById(subcriptionId);
    if (!subcription) {
      return res.status(404).json({ error: "404 subcription not found" });
    }

    const paypalSubcriptionId = subcription.reference;
    const access_token = await getPayPalToken();
    const response = await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions/${paypalSubcriptionId}/suspend`,
      { reason: "suspended by user" },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const freeUserRole = await roleModel.findOne({
      name: "Free User",
    });

    await accountTypeModel.findOneAndUpdate(
      { userId },
      { role: freeUserRole?._id },
      { new: true }
    );

    const subcriptionSaved = await subscriptionModel.findByIdAndUpdate(
      subcriptionId,
      {
        role: freeUserRole?._id,
      },
      { new: true }
    );

    return res.status(200).json(subcriptionSaved);
  } catch (error) {
    handleHttp(res, "Error_Get_Subscriptions_By_UserId", error);
  }
};
