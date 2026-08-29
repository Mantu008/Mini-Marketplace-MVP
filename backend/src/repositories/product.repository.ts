import prisma from "../config/database";
import { Prisma } from "@prisma/client";

interface FindAllOptions {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sellerId?: string;
}

export const productRepository = {
  async findAll(options: FindAllOptions = {}) {
    const { search, category, page = 1, limit = 12, sellerId } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  async create(data: {
    sellerId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
  }) {
    return prisma.product.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      imageUrl: string;
    }>
  ) {
    const updateData: Prisma.ProductUpdateInput = { ...data };
    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price);
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  async count(sellerId?: string) {
    return prisma.product.count(
      sellerId ? { where: { sellerId } } : undefined
    );
  },

  async getCategories() {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return categories.map((c) => c.category);
  },
};
