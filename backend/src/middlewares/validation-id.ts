import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import BadRequestError, { messageBadRequest } from '../errors/bad-request-error';

export default function validateId(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new BadRequestError(messageBadRequest.product));
  }

  return next();
}
