import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import NotFound, { messageNotFoundError } from '../errors/not-found-error';

export default function validateId(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new NotFound(messageNotFoundError.page));
  }

  return next();
}
