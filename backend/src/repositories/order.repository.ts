import prisma from "../config/database";
import { OrderStatus, Prisma } from "@prisma/client";

const orderInclude = {
  buyer: {
    select: { id: true, name: true, email: true },
  },
  orderItems: {
    include: {
      product: {
        select: { id: true, name: true, imageUrl: true, category: true },
      },
      seller: {
        select: { id: true, name: true },
      },
    },
  },
};

interface CreateOrderData {
  buyerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export const orderRepository = {
  async create(data: CreateOrderData) {
    return prisma.$transaction(async (tx) => {
      let totalAmount = new Prisma.Decimal(0);
      const orderItemsData: Array<{
        productId: string;
        sellerId: string;
        quantity: number;
        unitPrice: Prisma.Decimal;
        subtotal: Prisma.Decimal;
      }> = [];

      // Process each item
      for (const item of data.items) {
        // Lock the product row for update
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }

        const unitPrice = product.price;
        const subtotal = unitPrice.mul(item.quantity);

        orderItemsData.push({
          productId: product.id,
          sellerId: product.sellerId,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        });

        totalAmount = totalAmount.add(subtotal);

        // Decrease stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create order with items
      const order = await tx.order.create({
        data: {
          buyerId: data.buyerId,
          totalAmount,
          status: OrderStatus.PENDING,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: orderInclude,
      });

      return order;
    });
  },

  async findByBuyerId(buyerId: string) {
    return prisma.order.findMany({
      where: { buyerId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async findAll(status?: OrderStatus) {
    const where: Prisma.OrderWhereInput = {};
    if (status) {
      where.status = status;
    }

    return prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
  },

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
  },

  async count(status?: OrderStatus) {
    return prisma.order.count(status ? { where: { status } } : undefined);
  },

  async getTotalRevenue() {
    const result = await prisma.order.aggregate({
      where: { status: OrderStatus.COMPLETED },
      _sum: { totalAmount: true },
    });
    return result._sum.totalAmount || new Prisma.Decimal(0);
  },

  async getSellerRevenue(sellerId: string) {
    const result = await prisma.orderItem.aggregate({
      where: {
        sellerId,
        order: { status: OrderStatus.COMPLETED },
      },
      _sum: { subtotal: true },
    });
    return result._sum.subtotal || new Prisma.Decimal(0);
  },

  async getSellerOrderCount(sellerId: string) {
    const items = await prisma.orderItem.findMany({
      where: { sellerId },
      select: { orderId: true },
      distinct: ["orderId"],
    });
    return items.length;
  },
};
