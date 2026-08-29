import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", productController.getProducts);
router.get("/categories", productController.getCategories);
router.get("/:id", productController.getProduct);

// Seller routes
router.post(
  "/",
  authenticate,
  authorize("SELLER"),
  productController.createProduct
);
router.patch(
  "/:id",
  authenticate,
  authorize("SELLER"),
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticate,
  authorize("SELLER"),
  productController.deleteProduct
);

export default router;
