import NotFound, { messageNotFoundError } from '../errors/not-found-error';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export default function validateId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new NotFound(messageNotFoundError.page));
  }

  next();
}
