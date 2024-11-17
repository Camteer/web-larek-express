import BadUserRequestError, {
  messageBadUserRequest,
} from '../errors/user-error';
import { accessTokenSecret } from '../config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new BadUserRequestError(messageBadUserRequest.token));
  try {
    jwt.verify(token, accessTokenSecret);
    return next();
  } catch (error) {
    return next(new BadUserRequestError(messageBadUserRequest.noAuth));
  }
};
