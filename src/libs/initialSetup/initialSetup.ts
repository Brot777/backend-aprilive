import preferenceModel from "../../models/preference";
import roleModel from "../../models/role";
import { preferencesArray } from "./InitialData/preferences";
import { rolesArray } from "./InitialData/roles";

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

export const createInitialData = async () => {
  try {
    await createPreferences();
    await createRoles();
  } catch (error) {
    console.log(error);
  }
};
