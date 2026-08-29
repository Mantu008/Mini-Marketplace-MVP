"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { ProductsResponse } from "@/types/product";
import { TableSkeleton } from "@/components/common/Loading";
import ErrorState from "@/components/common/ErrorState";

export default function AdminProductsPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await api.get<ProductsResponse>("/products?limit=100");
      return res.data!;
    },
    enabled: isAuthenticated && user?.role === "ADMIN",
  });

  if (authLoading || isLoading) {
    return (
      <div className="container"><h1>Products</h1><TableSkeleton rows={5} /></div>
    );
  }

  if (isError) {
    return (
      <div className="container"><h1>Products</h1><ErrorState onRetry={() => refetch()} /></div>
    );
  }

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Seller</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((product) => (
              <tr key={product.id}>
                <td className="font-medium">{product.name}</td>
                <td className="table-secondary">{product.seller.name}</td>
                <td>{product.category}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>
                  <span className={product.stock === 0 ? "text-danger" : ""}>
                    {product.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
