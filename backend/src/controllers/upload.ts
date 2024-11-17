import { Request, Response, NextFunction } from "express";
import ServerError, { messageServerError } from "../errors/server-error";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }

    return res.status(200).json({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch {
    return next(new ServerError(messageServerError.server));
  }
};
