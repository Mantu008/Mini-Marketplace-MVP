"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Electronics", "Clothing", "Home & Garden", "Sports", "Books",
  "Toys", "Food & Beverages", "Health & Beauty", "Automotive", "Other",
];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", category: "", imageUrl: "",
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "SELLER")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async () => {
      const res = await api.get<Product>(`/products/${params.id}`);
      return res.data!;
    },
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: parseFloat(product.price).toString(),
        stock: product.stock.toString(),
        category: product.category,
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await api.patch(`/products/${params.id}`, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        category: form.category,
        imageUrl: form.imageUrl || undefined,
      });
      toast.success("Product updated successfully!");
      router.push("/seller/products");
    } catch (err: unknown) {
      const error = err as { message?: string; errors?: Record<string, string> };
      if (error.errors) setErrors(error.errors);
      else toast.error(error.message || "Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="page-loading"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => router.back()} className="btn btn-ghost btn-sm back-btn">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="form-page">
        <h1>Edit Product</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required minLength={3} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={4} minLength={10} />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input id="price" name="price" type="number" value={form.price} onChange={handleChange} required min="0.01" step="0.01" />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" step="1" />
              {errors.stock && <span className="form-error">{errors.stock}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (optional)</label>
            <input id="imageUrl" name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => router.back()} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
