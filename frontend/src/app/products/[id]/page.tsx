"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth-store";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ErrorState from "@/components/common/ErrorState";
import { Package, Minus, Plus, ArrowLeft, Store } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async () => {
      const res = await api.get<Product>(`/products/${params.id}`);
      return res.data!;
    },
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post<Order>("/orders", {
        items: [{ productId: params.id, quantity }],
      });
      return res.data!;
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setShowConfirm(false);
      router.push("/orders");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to place order.");
    },
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="product-detail-skeleton">
          <div className="skeleton skeleton-detail-image"></div>
          <div className="skeleton-detail-info">
            <div className="skeleton skeleton-title-lg"></div>
            <div className="skeleton skeleton-price-lg"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container">
        <ErrorState
          message="We couldn't load this product."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const price = parseFloat(product.price);
  const total = price * quantity;
  const canOrder =
    isAuthenticated && user?.role === "BUYER" && product.stock > 0;

  return (
    <div className="container">
      <button onClick={() => router.back()} className="btn btn-ghost btn-sm back-btn">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="product-image-placeholder large">
              <Package size={80} />
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-category-tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-price">${price.toFixed(2)}</p>

          <div className="product-stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In stock: {product.stock}</span>
            ) : (
              <span className="out-of-stock">✕ Out of stock</span>
            )}
          </div>

          <div className="product-seller-info">
            <Store size={16} />
            <span>Sold by {product.seller.name}</span>
          </div>

          <p className="product-description">{product.description}</p>

          {canOrder && (
            <div className="order-controls">
              <div className="quantity-control">
                <span className="quantity-label">Quantity</span>
                <div className="quantity-buttons">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="qty-btn"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="qty-btn"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowConfirm(true)}
                className="btn btn-primary btn-lg"
              >
                Place Order — ${total.toFixed(2)}
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <p className="login-prompt">
              <a href="/login">Login as a buyer</a> to place an order.
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Order"
        confirmLabel="Confirm Order"
        onConfirm={() => orderMutation.mutate()}
        onCancel={() => setShowConfirm(false)}
        isLoading={orderMutation.isPending}
      >
        <div className="order-summary">
          <h4>{product.name}</h4>
          <div className="summary-row">
            <span>Quantity</span>
            <span>{quantity}</span>
          </div>
          <div className="summary-row">
            <span>Price</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="summary-note">
            This order will be sent to the admin for approval.
          </p>
        </div>
      </ConfirmDialog>
    </div>
  );
}
