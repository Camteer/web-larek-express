import { Request, Response, NextFunction } from 'express';
import ServerError, { messageServerError } from '../errors/server-error';
import BadRequestError, { messageBadRequest } from '../errors/bad-request-error';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new BadRequestError(messageBadRequest.data));
    }

    return res.status(200).json({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch {
    return next(new ServerError(messageServerError.server));
  }
};
