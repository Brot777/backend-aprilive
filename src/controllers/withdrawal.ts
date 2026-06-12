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
import { typeTransaction } from "../consts/transactions";

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

    const withdrawalSaved=await withdrawalModel.create({
      userId,
      amount,
      status: "pendiente",
      email, 
    });

   await balanceTransactionModel.create({
      amount,
      increase: false,
      description: "retiro de dinero",
      typeTransaction:typeTransaction.withdrawal,
      referenceId:withdrawalSaved._id,
      userId,
    });

    
    

    return res.json({ message: "success" });
  } catch (error) {
    handleHttp(res, "Error_Create_Payout", error);
  }
};

export const getPendingWithdrawals=async (req:Request,res:Response)=>{
 /* paginate */
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);



  try {
    const withdrawals = await withdrawalModel
      .find({ status: "pendiente" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "userId",
        select: "_id name photoUrl isCompany",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })


    let totalDocs = await withdrawalModel.count({ status: "pendiente" }); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: withdrawals,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Pending_Verification", error);
  }
};

export const changeStatusWithdrawalById=async (req:Request,res:Response)=>
  {
  const withdrawalId: string = req.params.withdrawalId;
  let {status,rejectionReason=""} = req.body;
  try {


    const withdrawalFound = await withdrawalModel.findByIdAndUpdate(withdrawalId, { $set: { status } }, { new: true })
    if (!withdrawalFound) {
      return res.status(404).json({ error: "withdrawal not found" });
    }


    return res.status(201).json({ success: true, });

  } catch (error) {
    handleHttp(res, "Error_Update_Withdrawal", error);
  }
}