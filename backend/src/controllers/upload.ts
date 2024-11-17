import ServerError, { messageServerError } from '../errors/server-error';
import { Request, Response, NextFunction } from 'express';

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    res.status(200).json({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch {
    return next(new ServerError(messageServerError.server));
  }
};
