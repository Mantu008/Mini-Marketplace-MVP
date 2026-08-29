"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { StatsGridSkeleton } from "@/components/common/Loading";
import { Users, Package, Clock, ShoppingCart } from "lucide-react";

interface AdminStats {
  users: number;
  products: number;
  pendingOrders: number;
  totalOrders: number;
  revenue: string;
}

export default function AdminDashboardPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get<AdminStats>("/admin/stats");
      return res.data!;
    },
    enabled: isAuthenticated && user?.role === "ADMIN",
  });

  if (authLoading || isLoading) {
    return (
      <div className="container">
        <h1>Admin Dashboard</h1>
        <StatsGridSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid stats-grid-4">
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-content">
            <span className="stat-label">Users</span>
            <span className="stat-value">{stats?.users || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Package size={24} /></div>
          <div className="stat-content">
            <span className="stat-label">Products</span>
            <span className="stat-value">{stats?.products || 0}</span>
          </div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats?.pendingOrders || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ShoppingCart size={24} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats?.totalOrders || 0}</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link href="/admin/orders" className="action-card">
            <Clock size={24} />
            <span>Manage Orders</span>
          </Link>
          <Link href="/admin/users" className="action-card">
            <Users size={24} />
            <span>View Users</span>
          </Link>
          <Link href="/admin/products" className="action-card">
            <Package size={24} />
            <span>View Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
