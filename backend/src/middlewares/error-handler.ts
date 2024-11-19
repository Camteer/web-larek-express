import { Request, Response, NextFunction } from 'express';

export default function error(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(err.statusCode).send({ message: err.message });
}
