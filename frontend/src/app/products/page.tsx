"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { ProductsResponse } from "@/types/product";
import { ProductGridSkeleton } from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { Search, Package } from "lucide-react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", debouncedSearch, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "12");
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await api.get<ProductsResponse>(`/products?${params}`);
      return res.data!;
    },
  });

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Find products you&apos;ll love</h1>
          <p className="page-subtitle">
            Browse products from independent sellers.
          </p>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : isError ? (
        <ErrorState
          message="We couldn't load the products."
          onRetry={() => refetch()}
        />
      ) : !data || data.products.length === 0 ? (
        <EmptyState type="products" />
      ) : (
        <>
          <div className="product-grid">
            {data.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="product-card"
              >
                <div className="product-image">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <Package size={40} />
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-footer">
                    <span className="product-price">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <span
                      className={`stock-info ${product.stock === 0 ? "out-of-stock" : ""}`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {data.page} of {data.totalPages}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
