import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { userRepository } from "../repositories/user.repository";
import { productRepository } from "../repositories/product.repository";
import { orderRepository } from "../repositories/order.repository";
import { OrderStatus } from "@prisma/client";

export const userController = {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await userRepository.findAll();

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAdminStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [userCount, productCount, pendingCount, orderCount, revenue] =
        await Promise.all([
          userRepository.count(),
          productRepository.count(),
          orderRepository.count(OrderStatus.PENDING),
          orderRepository.count(),
          orderRepository.getTotalRevenue(),
        ]);

      res.json({
        success: true,
        data: {
          users: userCount,
          products: productCount,
          pendingOrders: pendingCount,
          totalOrders: orderCount,
          revenue: revenue.toString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getSellerStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sellerId = req.user!.id;

      const [productCount, orderCount, revenue] = await Promise.all([
        productRepository.count(sellerId),
        orderRepository.getSellerOrderCount(sellerId),
        orderRepository.getSellerRevenue(sellerId),
      ]);

      res.json({
        success: true,
        data: {
          products: productCount,
          orders: orderCount,
          revenue: revenue.toString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userRepository.findById(req.user!.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
