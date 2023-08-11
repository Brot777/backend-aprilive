import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const isValidToken = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization || "";
    const token = bearerToken.split(" ").pop();
    if (!token) {
      return res.status(404).json({ error: "no token provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded?._id;
  } catch (error) {
    return res.status(400).json({ error: "unauthorized" });
  }
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "something went wrong" });
  }
};
