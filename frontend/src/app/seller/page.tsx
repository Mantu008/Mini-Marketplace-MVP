"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { StatsGridSkeleton } from "@/components/common/Loading";
import { Package, ShoppingCart, DollarSign, Plus } from "lucide-react";

interface SellerStats {
  products: number;
  orders: number;
  revenue: string;
}

export default function SellerDashboardPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "SELLER")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["seller-stats"],
    queryFn: async () => {
      const res = await api.get<SellerStats>("/seller/stats");
      return res.data!;
    },
    enabled: isAuthenticated && user?.role === "SELLER",
  });

  if (authLoading || isLoading) {
    return (
      <div className="container">
        <h1>Seller Dashboard</h1>
        <StatsGridSkeleton />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}</p>
        </div>
        <Link href="/seller/products/create" className="btn btn-primary">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Products</span>
            <span className="stat-value">{stats?.products || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Orders</span>
            <span className="stat-value">{stats?.orders || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">
              ${parseFloat(stats?.revenue || "0").toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link href="/seller/products" className="action-card">
            <Package size={24} />
            <span>View Listings</span>
          </Link>
          <Link href="/seller/products/create" className="action-card">
            <Plus size={24} />
            <span>New Product</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
