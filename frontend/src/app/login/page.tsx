"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/auth-store";
import { api } from "@/lib/api";
import { AuthResponse } from "@/types/user";
import { LogIn, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      if (res.data) {
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);

        switch (res.data.user.role) {
          case "ADMIN":
            router.push("/admin");
            break;
          case "SELLER":
            router.push("/seller");
            break;
          default:
            router.push("/products");
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={32} />
          <h1>Welcome back</h1>
          <p>Sign in to your MarketFlow account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register">Create one</Link>
          </p>
        </div>

        <div className="demo-accounts">
          <p className="demo-title">Demo Accounts</p>
          <div className="demo-grid">
            <button
              onClick={() => {
                setEmail("admin@marketflow.com");
                setPassword("Admin123!");
              }}
              className="demo-btn"
            >
              <span className="demo-role">Admin</span>
              <span className="demo-email">admin@marketflow.com</span>
            </button>
            <button
              onClick={() => {
                setEmail("seller@example.com");
                setPassword("Seller123!");
              }}
              className="demo-btn"
            >
              <span className="demo-role">Seller</span>
              <span className="demo-email">seller@example.com</span>
            </button>
            <button
              onClick={() => {
                setEmail("buyer@example.com");
                setPassword("Buyer123!");
              }}
              className="demo-btn"
            >
              <span className="demo-role">Buyer</span>
              <span className="demo-email">buyer@example.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
