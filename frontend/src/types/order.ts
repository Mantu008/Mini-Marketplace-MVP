export type OrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
    category: string;
  };
  seller: {
    id: string;
    name: string;
  };
}

export interface Order {
  id: string;
  buyerId: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
