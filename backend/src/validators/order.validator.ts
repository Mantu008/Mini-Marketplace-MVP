import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Product ID must be a valid UUID"),
        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "At least one item is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
