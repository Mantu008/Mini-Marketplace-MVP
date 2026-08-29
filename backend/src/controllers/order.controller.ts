import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { orderService } from "../services/order.service";
import { createOrderSchema } from "../validators/order.validator";

export const orderController = {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder(req.user!.id, input);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getMyOrders(req.user!.id);

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders(
        req.query.status as string | undefined
      );

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id as string);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  async approveOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.approveOrder(req.params.id as string);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  async rejectOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.rejectOrder(req.params.id as string);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  async completeOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.completeOrder(req.params.id as string);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};
