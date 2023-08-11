import { model, Schema } from "mongoose";

const profileSchema = new Schema(
  {
    /* INICIO--- REQUERIDOS AL INICIAR SESION */
    /* FIN ----REQUERIDOS AL INICIAR SESION */
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default new model("Profile", profileSchema);
