import axios from "axios";
import {
  HOST,
  PAYPAL_API,
  PAYPAL_API_CLIENT_ID,
  PAYPAL_API_SECRET_KEY,
} from "../config/paypal";
import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { getPayPalToken } from "../services/payment";

export const createOrder = async (req: Request, res: Response) => {
  const { totalAmout, currency } = req.body;
  const userId = req.userId;
  const serviceId = req.params.serviceId;
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
        },
      ],
      application_context: {
        brand_name: "EXAMPLE INC",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/api/paymentService/capture-order`,
        cancel_url: `${HOST}/api/paymentService/cancel-order`,
      },
    };
    const access_token = await getPayPalToken();
    console.log(access_token);

    const { data } = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(data);

    const approvalUrl = data.links.find(
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

    const response = await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.json("capture");
  } catch (error) {
    handleHttp(res, "Error_Capture_Order", error);
  }
};
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    return res.json("cancel");
  } catch (error) {
    handleHttp(res, "Error_Cancel_Order", error);
  }
};
