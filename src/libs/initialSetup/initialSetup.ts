import preferenceModel from "../../models/preference";
import roleModel from "../../models/role";
import languajeModel from "../../models/languaje";
import { preferencesArray } from "./InitialData/preferences";
import { rolesArray } from "./InitialData/roles";
import { languajeArray } from "./InitialData/languajes";

const createPreferences = async () => {
  const countPreferences = await preferenceModel.estimatedDocumentCount();
  if (countPreferences > 0) return;
  await preferenceModel.insertMany(preferencesArray);
  console.log("susses create preferences in database");
};
const createRoles = async () => {
  const countRoles = await roleModel.estimatedDocumentCount();
  if (countRoles > 0) return;
  await roleModel.insertMany(rolesArray);
  console.log("susses create roles in database");
};
const createLnaguajes = async () => {
  const countLanguajes = await languajeModel.estimatedDocumentCount();
  if (countLanguajes > 0) return;
  await languajeModel.insertMany(languajeArray);
  console.log("susses create languajes in database");
};
export const createInitialData = async () => {
  try {
    await createPreferences();
    await createRoles();
    await createLnaguajes();
  } catch (error) {
    console.log(error);
  }
};
