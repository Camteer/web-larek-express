import { orderRouteValidator } from '../middlewares/validations';
import { createOrders } from '../controllers/order';
import { Router } from 'express';

const router = Router();

router.post('/', orderRouteValidator, createOrders);

export default router;
