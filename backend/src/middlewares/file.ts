import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { temp } from '../config';

const fileType = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../public/' + temp));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (fileType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = { fileSize: 1024 * 1024 * 10 };

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
