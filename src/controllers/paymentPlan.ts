import axios from "axios";
import { HOST, PAYPAL_API } from "../config/paypal";
import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { getPayPalToken } from "../utils/paypal";
import { premiumCompany } from "../consts/plans";
import subscriptionModel from "../models/subscription";
import roleModel from "../models/role";
import accountTypeModel from "../models/accountType";

export const subscribeToPremiumCompany = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const cycle = req.query.cycle ? `${req.query.cycle}` : "monthly";

  try {
    const suscription = {
      plan_id:
        cycle == "monthly"
          ? premiumCompany.monthly.paypalId
          : premiumCompany.annual.paypalId,
      application_context: {
        brand_name: "Aprilive",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${HOST}/api/paymentPlan/company/premium/success?userId=${userId}`,
        cancel_url: `${HOST}/api/paymentPlan/company/premium/cancel`,
      },
    };
    const access_token = await getPayPalToken();

    const response = await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions`,
      suscription,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status != 201) {
      return res
        .status(500)
        .send({ error: "Error_Subscribe_To_Premium_Company" });
    }

    const approvalUrl = response.data.links.find(
      (link: any) => link.rel === "approve"
    ).href;
    return res.json({ approvalUrl });
  } catch (error) {
    handleHttp(res, "Error_Create_Order", error);
  }
};
export const successSubscription = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  try {
    const subscriptionId = req.query.subscription_id;
    const access_token = await getPayPalToken();
    const response = await axios.get(
      `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.data.status != "ACTIVE") {
      return res.status(500).json({ error: "Error_Capture_Order" });
    }
    const premiumUserRole = await roleModel.findOne({
      name: "Premium User",
    });
    console.log(response.data);

    await subscriptionModel.create({
      userId,
      reference: subscriptionId,
      startedAt: response?.data?.start_time,
      finishAt: response?.data?.billing_info?.next_billing_time,
      role: premiumUserRole?._id,
    });

    await accountTypeModel.findOneAndUpdate(
      { userId },
      { role: premiumUserRole?._id },
      { new: true }
    );

    return res.json({ success: true });
  } catch (error) {
    handleHttp(res, "Error_Capture_Order", error);
  }
};
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    return res.json({ succes: false });
  } catch (error) {
    handleHttp(res, "Error_Cancel_Order", error);
  }
};
