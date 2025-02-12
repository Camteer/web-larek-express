import { celebrate, Joi, Segments } from 'celebrate';
import { IProduct } from '../models/products';
import { IOrder } from '../controllers/order';
import { IUser } from '../models/users';

const productSchemaFValidation = Joi.object<IProduct>({
  title: Joi.string().min(2).max(30).required(),
  image: {
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  },
  category: Joi.string().required(),
  description: Joi.string(),
  price: Joi.required(),
});

const orderSchemaValidation = Joi.object<IOrder>({
  payment: Joi.equal('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().items(Joi.string()).required(),
});

const userSchemaValidation = Joi.object<IUser>({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const productRouteValidator = celebrate({
  [Segments.BODY]: productSchemaFValidation,
});

export const orderRouteValidator = celebrate({
  [Segments.BODY]: orderSchemaValidation,
});

export const userRouteValidator = celebrate({
  [Segments.BODY]: userSchemaValidation,
});
