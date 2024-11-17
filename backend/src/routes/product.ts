import { productRouteValidator } from "../middlewares/validations";
import {
  createProducts,
  deleteProducts,
  getProducts,
  updateProducts,
} from "../controllers/products";
import { Router } from "express";

import auth from "../middlewares/auth";

const router = Router();

router.get("/", getProducts);
router.post("/", auth, productRouteValidator, createProducts);
router.patch("/:productId", auth, productRouteValidator, updateProducts);
router.delete("/:productId", auth, deleteProducts);

export default router;
