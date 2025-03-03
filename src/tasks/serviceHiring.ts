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

    for (const servicio of serviciosPendientes) {
      // Marcar servicio como completado
      await servicios.updateOne(
        { _id: servicio._id },
        { $set: { completado: true } }
      );

      // Crear la transacción
      await transacciones.insertOne({
        servicioId: servicio._id,
        compradorId: servicio.compradorId,
        prestadorId: servicio.prestadorId,
        monto: 100, // Ajusta según el servicio
        fecha: new Date()
      });

      console.log(updatedServices);
      
    console.log(
      `Servicios contratados actualizados: ${updatedServices.modifiedCount}`
    );
  } catch (error) {
    console.error("Error al actualizar los servicios:", error);
  }
});
