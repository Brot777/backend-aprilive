import cron from "node-cron";
import { serviceHiringModel } from "../models/serviceHiring";
import { Service } from "../interfaces/service";
import { ServiceHiring } from "../interfaces/serviceHiring";
import balanceTransactionModel from "../models/balanceTransaction";
// Tarea programada para ejecutarse todos los días a la medianoche
cron.schedule("0 0 * * *", async () => {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() - 10);

  try {
    const serviceHirings = await serviceHiringModel.find({
      status: "pendiente",
      estimatedDeliveryDate: { $lte: deadline },
    });
    const dataServiceHiringUpdated = await serviceHiringModel.updateMany(
      {
        status: "pendiente",
        estimatedDeliveryDate: { $lte: deadline },
      },
      {
        $set: {
          status: "completado",
        },
      }
    );

    serviceHirings.forEach(async (serviceHiring: ServiceHiring) => {
      const service = serviceHiring?.serviceId as Service;
      await balanceTransactionModel.create({
        amount: serviceHiring?.netAmount,
        increase: true,
        description: "prestación de servicio",
        paymentId: serviceHiring?.paymentId,
        userId: service.authorId,
      });
    });
    console.log("se actualizo" + dataServiceHiringUpdated.modifiedCount);
  } catch (error) {
    console.error("Error al actualizar los servicios:", error);
  }
});
