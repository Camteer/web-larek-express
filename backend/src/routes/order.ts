import { Router } from 'express';
import { orderRouteValidator } from '../middlewares/validations';
import { createOrders } from '../controllers/order';

const router = Router();

router.post('/', orderRouteValidator, createOrders);

export default router;
