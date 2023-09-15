/* import { Response, Request } from "express";

const ERROR_HANDLERS:any = {
  Unexpet_Error: (res: Response, error: unknown) => {
    res.status(400).json({ error: "Error Inesperado" });
  },
  defaultError: (res: Response, error: unknown) => {
    res.status(400).json({ error: "Error Inesperado" });
  },
};

export default (error: unknown, req: Request, res: Response) => {
  const handler = ERROR_HANDLERS[`${error?.name}`] || ERROR_HANDLERS.defaultError;
  handler(res, error);
};
 */
