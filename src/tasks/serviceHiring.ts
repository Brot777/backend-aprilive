import cron from "node-cron";
import { serviceHiringModel } from "../models/serviceHiring";
// Tarea programada para ejecutarse todos los días a la medianoche
cron.schedule("0 0 * * *", async () => {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() - 10);

  try {
    const updatedServices = await serviceHiringModel.updateMany(
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

    console.log(
      `Servicios contratados actualizados: ${updatedServices.modifiedCount}`
    );
  } catch (error) {
    console.error("Error al actualizar los servicios:", error);
  }
});
