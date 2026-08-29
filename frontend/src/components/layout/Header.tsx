"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/store/auth-store";
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMobileMenuOpen(false);
  };

  const getNavLinks = () => {
    if (!isAuthenticated || !user) {
      return [{ href: "/products", label: "Products", icon: Package }];
    }

    switch (user.role) {
      case "BUYER":
        return [
          { href: "/products", label: "Products", icon: Package },
          { href: "/orders", label: "My Orders", icon: ClipboardList },
        ];
      case "SELLER":
        return [
          { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
          { href: "/seller/products", label: "My Listings", icon: Package },
        ];
      case "ADMIN":
        return [
          { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
          { href: "/admin/orders", label: "Orders", icon: ClipboardList },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/products", label: "Products", icon: Package },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="header">
      <div className="header-container">
        <Link href={isAuthenticated ? (user?.role === "ADMIN" ? "/admin" : user?.role === "SELLER" ? "/seller" : "/products") : "/products"} className="header-logo">
          <ShoppingBag size={24} />
          <span>MarketFlow</span>
          {user?.role === "ADMIN" && (
            <span className="admin-badge">Admin</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "nav-link-active" : ""}`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <User size={16} />
                <span>{user?.name}</span>
                <span className="role-badge">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={16} />
                <span className="hide-mobile">Logout</span>
              </button>
            </>
          ) : (
            <div className="auth-links">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${pathname === link.href ? "nav-link-active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="mobile-nav-link">
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
