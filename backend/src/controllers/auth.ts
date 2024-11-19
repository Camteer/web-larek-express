import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import {
  accessTokenSecret,
  accessTokenExpiry,
  refreshTokenSecret,
  refreshTokenExpiry,
} from '../config';
import User from '../models/users';
import BadUserRequestError, {
  messageBadUserRequest,
} from '../errors/user-error';
import ServerError, { messageServerError } from '../errors/server-error';
import ConflictError, { messageConflictError } from '../errors/conflict-error';
import NotFound, { messageNotFoundError } from '../errors/not-found-error';
import BadRequestError, {
  messageBadRequest,
} from '../errors/bad-request-error';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ _id: userId }, accessTokenSecret, {
    expiresIn: ms(accessTokenExpiry),
  });
  const refreshToken = jwt.sign({ _id: userId }, refreshTokenSecret, {
    expiresIn: ms(refreshTokenExpiry),
  });
  return { accessToken, refreshToken };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashPassword, name });
    const { accessToken, refreshToken } = generateTokens(String(user._id));

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(refreshTokenExpiry),
      path: '/',
    });

    return res.status(201).send({
      user: { email, name },
      success: true,
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('E11000')) {
        return next(new ConflictError(messageConflictError.mail));
      }
      if (error.message.includes('ValidationError')) {
        return next(new BadRequestError(messageBadRequest.data))
      }
    }
    return next(new ServerError(messageServerError.server));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new BadUserRequestError(messageBadUserRequest.auth));
    }

    const { accessToken, refreshToken } = generateTokens(String(user._id));
    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(refreshTokenExpiry),
      path: '/',
    });

    return res.send({
      user: { email: user.email, name: user.name },
      success: true,
      accessToken,
    });
  } catch {
    return next(new ServerError(messageServerError.server));
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new BadUserRequestError(messageBadUserRequest.token));
    }

    const payload = jwt.verify(refreshToken, refreshTokenSecret) as {
      _id: string;
    };

    const user = await User.findById(payload._id).select('+tokens');

    if (!user || !user.tokens.some((t) => t.token === refreshToken)) {
      return next(new BadUserRequestError(messageBadUserRequest.invalidToken));
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      String(user._id)
    );

    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);

    user.tokens.push({ token: newRefreshToken });
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(refreshTokenExpiry),
      path: '/',
    });

    return res.send({
      user: { email: user.email, name: user.name },
      success: true,
      accessToken,
    });
  } catch {
    return next(new ServerError(messageServerError.server));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies.refreshToken;
    if (!refreshToken) {
      return next(new BadRequestError(messageBadRequest.token));
    }
    const payload = jwt.verify(refreshToken, refreshTokenSecret) as {
      _id: string;
    };
    const user = await User.findById(payload._id).select('+tokens');
    if (!user) return next(new NotFound(messageNotFoundError.user));

    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
    await user.save();

    res.clearCookie('refreshToken');
    return res.send({ success: true });
  } catch (err) {
    return next(new ServerError(messageServerError.server));
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return next(new BadUserRequestError(messageBadUserRequest.token));
    }

    const payload = jwt.verify(token, accessTokenSecret) as { _id: string };
    const user = await User.findById(payload._id);
    if (!user) {
      return next(new NotFound(messageNotFoundError.user));
    }
    return res.send({
      user: { email: user.email, name: user.name },
      success: true,
    });
  } catch (err) {
    return next(new ServerError(messageServerError.server));
  }
};
