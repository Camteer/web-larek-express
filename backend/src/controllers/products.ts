import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import Product, { IProduct } from "../models/products";
import ServerError, { messageServerError } from "../errors/server-error";
import ConflictError, { messageConflictError } from "../errors/conflict-error";
import BadRequestError, {
  messageBadRequest,
} from "../errors/bad-request-error";

const moveFile = (tempPath: string, targetPath: string) => {
  fs.renameSync(tempPath, targetPath);
};

export const getProducts = (
  req: Request<any, string, IProduct>,
  res: Response,
  next: NextFunction
) => {
  try {
    return Product.find({})
      .then((products) =>
        res.status(201).send({
          items: products,
          total: products.length,
        })
      )
      .catch((error) => {
        next(error);
      });
  } catch {
    return next(new ServerError(messageServerError.server));
  }
};

export const createProducts = async (
  req: Request<any, string, IProduct>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, category, price, image } = req.body;

    if (image) {
      const tempPath = path.join(
        __dirname,
        "..",
        "public",
        "temp",
        image.fileName.split("/")[2]
      );
      const targetPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        image.fileName.split("/")[2]
      );
      moveFile(tempPath, targetPath);
    } else {
      return next(new BadRequestError(messageBadRequest.data));
    }

    const newProduct = new Product({
      title,
      description,
      category,
      price,
      image,
    });
    newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000")) {
      return next(new ConflictError(messageConflictError.product));
    }
    return next(new ServerError(messageServerError.server));
  }
};

export const updateProducts = async (
  req: Request<any, string, IProduct>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    if (updates.image) {
      const tempPath = path.join(
        __dirname,
        "..",
        "public",
        "temp",
        updates.image.fileName.split("/")[2]
      );
      const targetPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        updates.image.fileName.split("/")[2]
      );
      moveFile(tempPath, targetPath);
    }

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    if (!product) {
      return next(new BadRequestError(messageBadRequest.product));
    }
    product.save();

    res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000")) {
      return next(new ConflictError(messageConflictError.product));
    }
    return next(new ServerError(messageServerError.server));
  }
};

export const deleteProducts = async (
  req: Request<any, string, IProduct>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new BadRequestError(messageBadRequest.product));
    }

    const filePath = path.join(
      __dirname,
      "..",
      "public",
      product.image.fileName
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json(product);
  } catch {
    return next(new ServerError(messageServerError.server));
  }
};
