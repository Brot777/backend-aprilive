import { Request, Response } from "express";

export const logSeervice = (req: Request, res: Response) => {
  console.log(req.body);
};
