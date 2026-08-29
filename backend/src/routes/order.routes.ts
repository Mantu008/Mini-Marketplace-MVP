import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Buyer routes
router.post("/", authenticate, authorize("BUYER"), orderController.createOrder);
router.get(
  "/my-orders",
  authenticate,
  authorize("BUYER"),
  orderController.getMyOrders
);

// Admin routes
router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  orderController.getAllOrders
);
router.get(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  orderController.getOrderById
);
router.patch(
  "/admin/:id/approve",
  authenticate,
  authorize("ADMIN"),
  orderController.approveOrder
);
router.patch(
  "/admin/:id/reject",
  authenticate,
  authorize("ADMIN"),
  orderController.rejectOrder
);
router.patch(
  "/admin/:id/complete",
  authenticate,
  authorize("ADMIN"),
  orderController.completeOrder
);

export default router;
