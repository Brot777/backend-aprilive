import axios from "axios";
import { HOST, PAYPAL_API } from "../config/paypal";
import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceHiringModel from "../models/serviceHiring";
import { getPayPalToken } from "../utils/paypal";

export const createOrder = async (req: Request, res: Response) => {
  const { totalAmount, currency, totalHours } = req.body;
  const customerId = req.userId;
  const serviceId = req.params.serviceId;
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: totalAmount,
          },
        },
      ],
      application_context: {
        brand_name: "Aprilive",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/api/paymentService/capture-order`,
        cancel_url: `${HOST}/api/paymentService/cancel-order`,
      },
    };
    const access_token = await getPayPalToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(response.data.id);

    if (response.status != 201) {
      return res.status(500).send({ error: "Error_Creating_Order" });
    }
    await serviceHiringModel.create({
      serviceId,
      customerId,
      paymentId: response?.data?.id,
      totalAmount,
      totalHours,
    });

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
