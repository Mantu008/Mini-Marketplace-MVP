"use client";

import { OrderStatus } from "@/types/order";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string; emoji: string }
> = {
  PENDING: { label: "Pending", className: "badge-warning", emoji: "🟡" },
  APPROVED: { label: "Approved", className: "badge-success", emoji: "🟢" },
  REJECTED: { label: "Rejected", className: "badge-danger", emoji: "🔴" },
  COMPLETED: { label: "Completed", className: "badge-info", emoji: "🔵" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`status-badge ${config.className}`}>
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
