"use client";

import { Package, ShoppingCart, AlertCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type: "products" | "orders" | "seller-listings" | "admin-orders" | "users";
  message?: string;
}

const emptyStates = {
  products: {
    icon: Package,
    title: "No products found",
    description: "Try changing your search or filters.",
    action: null,
  },
  orders: {
    icon: ShoppingCart,
    title: "No orders yet",
    description: "Start shopping to see your orders here.",
    action: { href: "/products", label: "Browse Products" },
  },
  "seller-listings": {
    icon: Package,
    title: "You haven't created any listings yet.",
    description: "Start selling by creating your first product listing.",
    action: { href: "/seller/products/create", label: "Create Listing" },
  },
  "admin-orders": {
    icon: AlertCircle,
    title: "You're all caught up.",
    description: "There are no pending orders.",
    action: null,
  },
  users: {
    icon: AlertCircle,
    title: "No users found.",
    description: "",
    action: null,
  },
};

export default function EmptyState({ type, message }: EmptyStateProps) {
  const state = emptyStates[type];
  const Icon = state.icon;

  return (
    <div className="empty-state">
      <Icon size={48} strokeWidth={1.5} />
      <h3>{state.title}</h3>
      <p>{message || state.description}</p>
      {state.action && (
        <Link href={state.action.href} className="btn btn-primary">
          {state.action.label}
        </Link>
      )}
    </div>
  );
}
