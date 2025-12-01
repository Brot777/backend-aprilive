import { NextFunction, Request, Response } from "express";
import serviceModel from "../models/service";
import geoip from "geoip-lite";

export const isAuthorAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serviceId = req.params.serviceId;
  try {
    const service = await serviceModel.findById(serviceId);
    if (req.userId == service?.authorId.toString()) {
      return res.status(401).json({ error: "you can't hire yourself" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const getCoordinates = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "";
  console.log(ip);
  ip === "::1" && (ip = "190.148.0.0");
  const geo = geoip.lookup(ip);
  console.log(geo);

  if (geo) {
    req.geo = {
      country: geo.country,
      city: geo.city,
      ll: geo.ll as [number, number], // lat, lon
    };
  }

  // No asignes null → mejor deja undefined
  next();
};
