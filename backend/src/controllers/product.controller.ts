import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { productService } from "../services/product.service";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator";

export const productController = {
  async getProducts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await productService.getProducts({
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id as string);

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createProductSchema.parse(req.body);
      const product = await productService.createProduct(req.user!.id, input);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(
        req.params.id as string,
        req.user!.id,
        input
      );

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await productService.deleteProduct(
        req.params.id as string,
        req.user!.id
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  },
};
