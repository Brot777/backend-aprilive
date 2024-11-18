import axios from "axios";
import { HOST, PAYPAL_API } from "../config/paypal";
import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { getPayPalToken } from "../services/paymentService";
import serviceHiringModel from "../models/serviceHiring";

export const createOrder = async (req: Request, res: Response) => {
  const { totalAmout, currency, totalHours } = req.body;
  const customerId = req.userId;
  const serviceId = req.params.serviceId;
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: totalAmout,
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

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.status != 201) {
      return res.status(500).send({ error: "Error_Creating_Order" });
    }
    await serviceHiringModel.create({
      serviceId,
      customerId,
      paymentId: response.data.id,
      totalAmout,
      totalHours,
    });
    console.log(response);
    console.log(response.data);

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
  console.log(token);

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
