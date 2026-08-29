import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must be at most 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(999999.99, "Price must be at most 999,999.99"),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock must be 0 or greater"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be at most 100 characters"),
  imageUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
