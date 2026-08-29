import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Profile
router.get("/profile", authenticate, userController.getProfile);

// Seller stats
router.get(
  "/seller/stats",
  authenticate,
  authorize("SELLER"),
  userController.getSellerStats
);

// Admin routes
router.get(
  "/admin/users",
  authenticate,
  authorize("ADMIN"),
  userController.getUsers
);
router.get(
  "/admin/stats",
  authenticate,
  authorize("ADMIN"),
  userController.getAdminStats
);

export default router;
