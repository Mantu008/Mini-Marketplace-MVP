import { productRepository } from "../repositories/product.repository";
import { AppError } from "../middleware/error.middleware";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../validators/product.validator";

export const productService = {
  async getProducts(query: {
    search?: string;
    category?: string;
    page?: string;
    limit?: string;
  }) {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "12", 10);

    return productRepository.findAll({
      search: query.search,
      category: query.category,
      page: Math.max(1, page),
      limit: Math.min(50, Math.max(1, limit)),
    });
  },

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }
    return product;
  },

  async createProduct(sellerId: string, input: CreateProductInput) {
    return productRepository.create({
      sellerId,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category: input.category,
      imageUrl: input.imageUrl || undefined,
    });
  },

  async updateProduct(
    productId: string,
    sellerId: string,
    input: UpdateProductInput
  ) {
    // Check product exists and ownership
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    if (product.sellerId !== sellerId) {
      throw new AppError(
        "You can only update your own products.",
        403
      );
    }

    return productRepository.update(productId, input);
  },

  async deleteProduct(productId: string, sellerId: string) {
    // Check product exists and ownership
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    if (product.sellerId !== sellerId) {
      throw new AppError(
        "You can only delete your own products.",
        403
      );
    }

    await productRepository.delete(productId);
    return { message: "Product deleted successfully." };
  },

  async getSellerProducts(sellerId: string) {
    return productRepository.findAll({ sellerId });
  },

  async getCategories() {
    return productRepository.getCategories();
  },
};
