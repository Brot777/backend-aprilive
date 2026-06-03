import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { PAYPAL_API } from "../config/paypal";
import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { serviceHiringModel } from "../models/serviceHiring";
import { getPayPalToken } from "../utils/paypal";
import withdrawalModel from "../models/withdrawal";
import balanceTransactionModel from "../models/balanceTransaction";
import { getTotalBalance } from "../services/transaction";

export const createPayout = async (req: Request, res: Response) => {
  const { amount, email } = req.body;
  const userId = req.userId;
  const senderBatchId = `payout_${uuidv4()}`;
  try {
    const totalBalance = await getTotalBalance(userId);

    if (Number(totalBalance) < Number(amount)) {
      return res.status(400).send({
        error: "the amount to be withdrawn exceeds the total balance",
      });
    }
    if (10 >= Number(amount)) {
      return res.status(400).send({
        error: "The minimum amount to withdraw is 10 USD",
      });
    }
    // const access_token = await getPayPalToken();

    // const payoutRequest = {
    //   sender_batch_header: {
    //     sender_batch_id: senderBatchId,
    //     email_subject: "Retiro aprobado",
    //     email_message: "Has recibido un pago",
    //   },
    //   items: [
    //     {
    //       recipient_type: "EMAIL",
    //       amount: { value: Number(amount).toFixed(2), currency: "USD" },
    //       receiver: email,
    //       note: "Retiro solicitado",
    //       sender_item_id: senderBatchId,
    //     },
    //   ],
    // };

    // const response = await axios.post(
    //   `${PAYPAL_API}/v1/payments/payouts`,
    //   payoutRequest,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // console.log(response.data);

    // if (response.status != 201) {
    //   return res.status(500).send({ error: "Error_Creating_Payout" });
    // }

   const balanceTransactionSaved= await balanceTransactionModel.create({
      amount,
      increase: false,
      description: "retiro de dinero",
      userId,
    });

    await withdrawalModel.create({
      userId,
      amount,
      status: "pendiente",
      email, 
      balanceTransactionId:balanceTransactionSaved._id,
    });
    

    return res.json({ message: "success" });
  } catch (error) {
    handleHttp(res, "Error_Create_Payout", error);
  }
};

export const getWithdrawals=async (req:Request,res:Response)=>{}

export const changeStatusWithdrawalById=async (req:Request,res:Response)=>{}
