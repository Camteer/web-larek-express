import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/products';
import BadRequestError, {
  messageBadRequest,
} from '../errors/bad-request-error';
import ServerError, { messageServerError } from '../errors/server-error';
import NotFound, { messageNotFoundError } from '../errors/not-found-error';

type TPayment = 'card' | 'online';

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
  next: NextFunction,
) => {
  try {
    const { total, items } = req.body;
    const orderId = faker.string.uuid();
    let sum = 0;
    /* eslint-disable */
    for await (const id of items) {
      const product = await Product.findById(id);
      if (!product) {
        return next(new NotFound(messageNotFoundError.page));
      }
      if (product.price === null) {
        return next(new BadRequestError(messageBadRequest.price));
      }
      sum += product.price;
    }
    if (total != sum) {
      return next(new BadRequestError(messageBadRequest.total));
    }
    return res.status(200).send({ id: orderId, total });
  } catch (err) {
    return next(new ServerError(messageServerError.server));
  }
};
