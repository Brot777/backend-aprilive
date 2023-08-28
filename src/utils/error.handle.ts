import { Response } from "express";

export const handleHttp = (res: Response, error: string, errorRaw: unknown) => {
  console.log(errorRaw);
  res.status(500).send({ error });
};
