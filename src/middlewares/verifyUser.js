import userModel from "../models/user.model.js";

export const checkDuplicateUsername = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (user) {
      return res
        .status(401)
        .json({ error: "Este nombre de usuario ya existe" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
    console.log(error);
  }
};
export const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(401)
        .json({ error: "Este correo electronico ya esta en uso" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
    console.log(error);
  }
};
