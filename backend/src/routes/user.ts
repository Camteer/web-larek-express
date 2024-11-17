import { Router } from 'express';
import { userRouteValidator } from '../middlewares/validations';
import {
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from '../controllers/auth';

const router = Router();

router.post('/register', userRouteValidator, register);
router.post('/login', userRouteValidator, login);
router.get('/token', refreshAccessToken);
router.get('/logout', logout);
router.get('/user', getCurrentUser);

export default router;
