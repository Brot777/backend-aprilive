import axios from "axios";
import { HOST, PAYPAL_API } from "../config/paypal";
import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import serviceHiringModel from "../models/serviceHiring";
import { getPayPalToken } from "../utils/paypal";

export const createPayout = async (req: Request, res: Response) => {
  const { amount, email, senderBatchId } = req.body;
  const customerId = req.userId;
  const serviceId = req.params.serviceId;
  try {
    const access_token = await getPayPalToken();

    const payoutRequest = {
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: "Retiro aprobado",
        email_message: "Has recibido un pago",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: { value: Number(amount).toFixed(2), currency: "USD" },
          receiver: email,
          note: "Retiro solicitado",
          sender_item_id: senderBatchId,
        },
      ],
    };

    const response = await axios.post(
      `${PAYPAL_API}/v1/payments/payouts`,
      payoutRequest,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);

    if (response.status != 201) {
      return res.status(500).send({ error: "Error_Creating_Payout" });
    }

    return res.json({ message: "success" });
  } catch (error) {
    handleHttp(res, "Error_Create_Payout", error);
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
