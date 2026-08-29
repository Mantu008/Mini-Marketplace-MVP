"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/products");
      return;
    }

    switch (user?.role) {
      case "ADMIN":
        router.push("/admin");
        break;
      case "SELLER":
        router.push("/seller");
        break;
      default:
        router.push("/products");
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="page-loading">
      <div className="spinner"></div>
    </div>
  );
}
