import preferenceModel from "../../models/preference";
import roleModel from "../../models/role";
import languajeModel from "../../models/languaje";
import skillModel from "../../models/skill";
import categoryModel from "../../models/category";
import networkModel from "../../models/network";
import { preferencesArray } from "./InitialData/preferences";
import { rolesArray } from "./InitialData/roles";
import { languajesArray } from "./InitialData/languajes";
import { skillsArray } from "./InitialData/skills";
import { categoriesArray } from "./InitialData/categories";
import { networkArray } from "./InitialData/networks";

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
const createLanguajes = async () => {
  const countLanguajes = await languajeModel.estimatedDocumentCount();
  if (countLanguajes > 0) return;
  await languajeModel.insertMany(languajesArray);
  console.log("susses create languajes in database");
};

const createSkills = async () => {
  const countSkills = await skillModel.estimatedDocumentCount();
  if (countSkills > 0) return;
  await skillModel.insertMany(skillsArray);
  console.log("susses create skills in database");
};

const createCategories = async () => {
  const countCategories = await categoryModel.estimatedDocumentCount();
  if (countCategories > 0) return;
  await categoryModel.insertMany(categoriesArray);
  console.log("susses create categories in database");
};
const createNetworks = async () => {
  const countNetworks = await networkModel.estimatedDocumentCount();
  if (countNetworks > 0) return;
  await networkModel.insertMany(networkArray);
  console.log("susses create networks in database");
};
export const createInitialData = async () => {
  try {
    await Promise.all([
      createPreferences(),
      createRoles(),
      createLanguajes(),
      createSkills(),
      createCategories(),
      createNetworks(),
    ]);
  } catch (error) {
    console.log(error);
  }
};
