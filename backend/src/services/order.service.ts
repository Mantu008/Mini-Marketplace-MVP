import { OrderStatus } from "@prisma/client";
import { orderRepository } from "../repositories/order.repository";
import { AppError } from "../middleware/error.middleware";
import { CreateOrderInput } from "../validators/order.validator";

export const orderService = {
  async createOrder(buyerId: string, input: CreateOrderInput) {
    try {
      return await orderRepository.create({
        buyerId,
        items: input.items,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("Product not found") ||
          error.message.includes("Insufficient stock")
        ) {
          throw new AppError(error.message, 400);
        }
      }
      throw error;
    }
  },

  async getMyOrders(buyerId: string) {
    return orderRepository.findByBuyerId(buyerId);
  },

  async getAllOrders(status?: string) {
    const validStatus = status as OrderStatus | undefined;
    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new AppError("Invalid order status filter.", 400);
    }
    return orderRepository.findAll(validStatus);
  },

  async getOrderById(id: string) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new AppError("Order not found.", 404);
    }
    return order;
  },

  async approveOrder(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(
        `Cannot approve order. Current status is ${order.status}. Only PENDING orders can be approved.`,
        400
      );
    }

    return orderRepository.updateStatus(orderId, OrderStatus.APPROVED);
  },

  async rejectOrder(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(
        `Cannot reject order. Current status is ${order.status}. Only PENDING orders can be rejected.`,
        400
      );
    }

    return orderRepository.updateStatus(orderId, OrderStatus.REJECTED);
  },

  async completeOrder(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    if (order.status !== OrderStatus.APPROVED) {
      throw new AppError(
        `Cannot complete order. Current status is ${order.status}. Only APPROVED orders can be completed.`,
        400
      );
    }

    return orderRepository.updateStatus(orderId, OrderStatus.COMPLETED);
  },
};
