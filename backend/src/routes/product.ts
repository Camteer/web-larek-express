import { Router } from 'express';
import { productRouteValidator } from '../middlewares/validations';
import {
  createProducts,
  deleteProducts,
  getProducts,
  updateProducts,
} from '../controllers/products';

import auth from '../middlewares/auth';
import validateId from '../middlewares/validation-id';

const router = Router();

router.get('/', getProducts);
router.post('/', auth, productRouteValidator, createProducts);
router.patch(
  '/:productId',
  auth,
  validateId,
  productRouteValidator,
  updateProducts,
);
router.delete('/:productId', auth, validateId, deleteProducts);

export default router;
