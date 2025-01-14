import axios from "axios";
import { HOST, PAYPAL_API } from "../config/paypal";
import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceHiringModel from "../models/serviceHiring";
import { getPayPalToken } from "../utils/paypal";

import { premiumCompany } from "../consts/plans";

export const subscribeToPremiumCompany = async (
  req: Request,
  res: Response
) => {
  const Id = req.userId;
  const cycle = req.query.cycle ? `${req.query.cycle}` : "monthly";
  console.log("paso bien");

  try {
    const suscription = {
      plan_id:
        cycle == "monthly"
          ? premiumCompany.monthly.paypalId
          : premiumCompany.annual.paypalId,
      application_context: {
        brand_name: "Aprilive",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${HOST}/api/paymentPlan/company/premium/capture-order`,
        cancel_url: `${HOST}/api/paymentPlan/company/premium/cancel-order`,
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
    console.log(response.data);

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
export const captureOrder = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const access_token = await getPayPalToken();

    await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    await serviceHiringModel.findOneAndUpdate(
      { paymentId: token },
      {
        status: "pendiente",
      }
    );

    return res.json({ succes: true });
  } catch (error) {
    handleHttp(res, "Error_Capture_Order", error);
  }
};
export const cancelOrder = async (req: Request, res: Response) => {
  const { token } = req.query;
  try {
    await serviceHiringModel.findOneAndDelete({ paymentId: token });
    return res.json({ succes: false });
  } catch (error) {
    handleHttp(res, "Error_Cancel_Order", error);
  }
};
