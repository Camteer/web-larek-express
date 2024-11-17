import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";
import Product from "../models/products";
import BadRequestError, {
  messageBadRequest,
} from "../errors/bad-request-error";
import ServerError, { messageServerError } from "../errors/server-error";
type TPayment = "card" | "online";

export interface IOrder {
  phone: string;
  payment: TPayment;
  email: string;
  address: string;
  total: number;
  items: string[];
}

export const createOrders = async (
  req: Request<any, string, IOrder>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { total, items } = req.body;
    const orderId = faker.string.uuid();
    let sum = 0;
    for await (let id of items) {
      let product = await Product.findById(id);
      if (!product) {
        return next(new BadRequestError(messageBadRequest.product));
      }
      if (product.price === null) {
        return next(new BadRequestError(messageBadRequest.price));
      }
      sum += product.price;
    }
    if (total != sum) {
      return next(new BadRequestError(messageBadRequest.total));
    }
    return res.status(201).send({ id: orderId, total });
  } catch (err) {
    return next(new ServerError(messageServerError.server));
  }
};
