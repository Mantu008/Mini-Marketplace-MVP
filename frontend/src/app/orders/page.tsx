"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth-store";
import { Order } from "@/types/order";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import { TableSkeleton } from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrdersPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "BUYER")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get<Order[]>("/orders/my-orders");
      return res.data!;
    },
    enabled: isAuthenticated && user?.role === "BUYER",
  });

  if (authLoading || isLoading) {
    return (
      <div className="container">
        <h1>My Orders</h1>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <h1>My Orders</h1>
        <ErrorState
          message="We couldn't load your orders."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container">
        <h1>My Orders</h1>
        <EmptyState type="orders" />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span className="order-id">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="order-items">
              {order.orderItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <span className="order-item-name">
                      {item.product.name}
                    </span>
                    <span className="order-item-qty">
                      Qty: {item.quantity} × ${parseFloat(item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                  <span className="order-item-subtotal">
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span className="order-total">
                Total: ${parseFloat(order.totalAmount).toFixed(2)}
              </span>
              <span className="order-date">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
