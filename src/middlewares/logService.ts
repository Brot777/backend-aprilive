import { NextFunction, Request, Response } from "express";

export const logSeervice = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req);
  next();
};
