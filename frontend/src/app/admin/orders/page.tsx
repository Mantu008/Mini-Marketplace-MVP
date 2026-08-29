"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { Order, OrderStatus } from "@/types/order";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import { TableSkeleton } from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Check, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_FILTERS: Array<{ label: string; value: string }> = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Completed", value: "COMPLETED" },
];

export default function AdminOrdersPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [actionOrder, setActionOrder] = useState<{
    order: Order;
    action: "approve" | "reject" | "complete";
  } | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const res = await api.get<Order[]>(`/orders/admin${params}`);
      return res.data!;
    },
    enabled: isAuthenticated && user?.role === "ADMIN",
  });

  const actionMutation = useMutation({
    mutationFn: async ({
      orderId,
      action,
    }: {
      orderId: string;
      action: string;
    }) => {
      await api.patch(`/orders/admin/${orderId}/${action}`);
    },
    onSuccess: (_, variables) => {
      const actionLabel =
        variables.action === "approve"
          ? "approved"
          : variables.action === "reject"
            ? "rejected"
            : "completed";
      toast.success(`Order ${actionLabel} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller-stats"] });
      setActionOrder(null);
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to update order.");
    },
  });

  const getDialogConfig = () => {
    if (!actionOrder) return { title: "", label: "", variant: "primary" as const };

    switch (actionOrder.action) {
      case "approve":
        return {
          title: "Approve Order",
          label: "Approve",
          variant: "success" as const,
        };
      case "reject":
        return {
          title: "Reject Order",
          label: "Reject",
          variant: "danger" as const,
        };
      case "complete":
        return {
          title: "Complete Order",
          label: "Complete",
          variant: "success" as const,
        };
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container">
        <h1>Order Management</h1>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <h1>Order Management</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const dialogConfig = getDialogConfig();

  return (
    <div className="container">
      <h1>Order Management</h1>

      <div className="filter-bar">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`filter-btn ${statusFilter === filter.value ? "filter-active" : ""}`}
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {!orders || orders.length === 0 ? (
        <EmptyState type="admin-orders" />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Buyer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id-cell">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td>
                    <div>
                      <div className="table-primary">{order.buyer.name}</div>
                      <div className="table-secondary">{order.buyer.email}</div>
                    </div>
                  </td>
                  <td>
                    {order.orderItems
                      .map((item) => `${item.product.name} (x${item.quantity})`)
                      .join(", ")}
                  </td>
                  <td className="font-medium">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="table-secondary">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="table-actions">
                      {order.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              setActionOrder({
                                order,
                                action: "approve",
                              })
                            }
                            className="btn btn-success btn-sm"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() =>
                              setActionOrder({
                                order,
                                action: "reject",
                              })
                            }
                            className="btn btn-danger btn-sm"
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      )}
                      {order.status === "APPROVED" && (
                        <button
                          onClick={() =>
                            setActionOrder({
                              order,
                              action: "complete",
                            })
                          }
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle size={14} /> Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!actionOrder}
        title={dialogConfig.title}
        confirmLabel={dialogConfig.label}
        confirmVariant={dialogConfig.variant}
        onConfirm={() =>
          actionOrder &&
          actionMutation.mutate({
            orderId: actionOrder.order.id,
            action: actionOrder.action,
          })
        }
        onCancel={() => setActionOrder(null)}
        isLoading={actionMutation.isPending}
      >
        {actionOrder && (
          <div className="order-summary">
            <p>
              Order <strong>#{actionOrder.order.id.slice(0, 8).toUpperCase()}</strong>
            </p>
            <p>
              Buyer: <strong>{actionOrder.order.buyer.name}</strong>
            </p>
            <p>
              Amount:{" "}
              <strong>
                ${parseFloat(actionOrder.order.totalAmount).toFixed(2)}
              </strong>
            </p>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
