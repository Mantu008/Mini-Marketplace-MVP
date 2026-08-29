"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Product, ProductsResponse } from "@/types/product";
import { TableSkeleton } from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SellerProductsPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "SELLER")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["seller-products"],
    queryFn: async () => {
      const res = await api.get<ProductsResponse>(
        `/products?sellerId=${user?.id}&limit=100`
      );
      return res.data!;
    },
    enabled: isAuthenticated && user?.role === "SELLER",
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      setDeleteProduct(null);
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to delete product.");
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="container">
        <h1>My Listings</h1>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <h1>My Listings</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Listings</h1>
        <Link href="/seller/products/create" className="btn btn-primary">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState type="seller-listings" />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      <span className="table-product-name">{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        product.stock === 0 ? "text-danger" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="btn btn-ghost btn-sm"
                      >
                        <Edit size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => setDeleteProduct(product)}
                        className="btn btn-ghost btn-sm text-danger"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteProduct}
        title="Delete Product"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={() =>
          deleteProduct && deleteMutation.mutate(deleteProduct.id)
        }
        onCancel={() => setDeleteProduct(null)}
        isLoading={deleteMutation.isPending}
      >
        <p>
          Are you sure you want to delete <strong>{deleteProduct?.name}</strong>?
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </div>
  );
}
