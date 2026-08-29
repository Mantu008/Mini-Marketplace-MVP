# MarketFlow — Full-Stack Marketplace MVP

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mini--marketplace--mvp--2281.vercel.app-blue?style=for-the-badge&logo=vercel)](https://mini-marketplace-mvp-2281.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

A full-stack marketplace MVP built with **Buyer, Seller, and Admin roles**, **JWT authentication**, **transactional order lifecycle**, **PostgreSQL database via Prisma ORM**, and a clean, responsive UI with **multi-tab session persistence**.

---

## 🌐 Live Deployments

- **Frontend Web Application**: [https://mini-marketplace-mvp-2281.vercel.app](https://mini-marketplace-mvp-2281.vercel.app/)
- **Production URL**: [https://mini-marketplace-mvp.vercel.app](https://mini-marketplace-mvp.vercel.app/)
- **Backend API Base**: [https://mini-marketplace-mvp.vercel.app/api](https://mini-marketplace-mvp.vercel.app/api)
- **API Health Check**: [https://mini-marketplace-mvp.vercel.app/api/health](https://mini-marketplace-mvp.vercel.app/api/health)

---

## 🔑 Demo Accounts (Pre-Seeded)

The login screen features **one-click demo account buttons** for rapid testing across different roles:

| Role | Email | Password | Allowed Capabilities |
|---|---|---|---|
| **Admin** | `admin@marketflow.com` | `Admin123!` | View all orders, Approve/Reject pending orders, Complete approved orders, View all users & products, Dashboard analytics |
| **Seller** | `seller@example.com` | `Seller123!` | Create product listings, Edit/Delete own products, View seller stats & revenue |
| **Buyer** | `buyer@example.com` | `Buyer123!` | Browse & search products, Place orders with quantity selection, Track order status in real time |

---

## 🔄 End-to-End Workflow

```text
1. SELLER LOGIN ──────> Creates Product Listing ("MacBook Air M3", $999, Stock: 5)
                            ↓
2. BUYER LOGIN ───────> Browses catalog, selects quantity, clicks [Place Order]
                            ↓
3. ORDER STATUS ──────> Order created with status: PENDING (Stock decremented atomically)
                            ↓
4. ADMIN LOGIN ───────> Views pending orders, clicks [Approve]
                            ↓
5. ORDER STATUS ──────> Order transitions: PENDING → APPROVED
                            ↓
6. ADMIN COMPLETE ────> Admin clicks [Complete]
                            ↓
7. FINAL STATUS ──────> Order transitions: APPROVED → COMPLETED
                            ↓
8. BUYER VIEW ────────> Buyer sees live updated status: COMPLETED (Auto-synced across tabs)
```

---

## 📐 Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│             Next.js 16 Frontend (App Router)           │
│  - TypeScript, Tailwind CSS, TanStack Query            │
│  - Multi-tab isolated sessionStorage                   │
│  - 3s live polling & window-focus synchronization      │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (JWT Bearer)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Express.js REST API Backend                │
│  - TypeScript, Zod Validation, JWT Auth, Bcrypt        │
│  - Role-based Authorization Middleware                 │
│  - Atomic Database Transactions ($transaction)         │
└───────────────────────────┬────────────────────────────┘
                            │ Prisma ORM
                            ▼
┌────────────────────────────────────────────────────────┐
│             PostgreSQL Database (Supabase)             │
│  - Tables: users, products, orders, order_items        │
│  - Enums: Role (BUYER, SELLER, ADMIN)                  │
│           OrderStatus (PENDING, APPROVED, REJECTED,    │
│                        COMPLETED)                      │
└────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
marketflow/
├── backend/
│   ├── api/
│   │   └── index.ts                 # Vercel Serverless Function entrypoint
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma schema (User, Product, Order, OrderItem)
│   │   └── seed.ts                  # Database seed script
│   ├── src/
│   │   ├── config/ (env.ts, database.ts)
│   │   ├── controllers/ (auth, product, order, user)
│   │   ├── middleware/ (auth, role, error)
│   │   ├── repositories/ (user, product, order)
│   │   ├── routes/ (auth, product, order, user)
│   │   ├── services/ (auth, product, order)
│   │   ├── utils/ (jwt.ts, password.ts)
│   │   ├── validators/ (auth, product, order)
│   │   └── app.ts                   # Express application setup & CORS
│   ├── vercel.json                  # Backend edge-level CORS configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Role-based root redirect
│   │   │   ├── layout.tsx           # Global layout & Providers
│   │   │   ├── globals.css          # Design system & tokens
│   │   │   ├── login/page.tsx       # Login with demo quick-select
│   │   │   ├── register/page.tsx    # Registration (Buyer/Seller)
│   │   │   ├── products/page.tsx    # Browse catalog with 400ms debounced search
│   │   │   ├── products/[id]/page.tsx # Product detail & order modal
│   │   │   ├── orders/page.tsx      # Buyer order history & badges
│   │   │   ├── seller/page.tsx      # Seller dashboard & stats
│   │   │   ├── seller/products/page.tsx # Seller listings table
│   │   │   ├── seller/products/create/page.tsx # Create listing
│   │   │   ├── seller/products/[id]/edit/page.tsx # Edit listing
│   │   │   ├── admin/page.tsx       # Admin dashboard & 4 metric cards
│   │   │   ├── admin/orders/page.tsx # Admin order management
│   │   │   ├── admin/users/page.tsx # Admin user list
│   │   │   └── admin/products/page.tsx # Admin product catalog
│   │   ├── components/
│   │   │   ├── common/ (ConfirmDialog, EmptyState, ErrorState, Loading, OrderStatusBadge)
│   │   │   └── layout/ (Header, Providers, ToastProvider)
│   │   ├── lib/ (api.ts)
│   │   ├── store/ (auth-store.tsx - multi-tab session isolated)
│   │   └── types/ (user.ts, product.ts, order.ts)
│   ├── vercel.json                  # Next.js SPA clean routing configuration
│   ├── package.json
│   ├── .env.local
│   └── .env.production
├── vercel.json                      # Monorepo Vercel configuration
└── README.md
```

---

## 🛡️ Key Features & Business Rules

1. **Transactional Order Flow**:
   - Inventory verification, row locking, subtotal calculation using server-side prices, and stock reduction are executed atomically inside a Prisma transaction (`$transaction`).
2. **Strict Status Lifecycle**:
   - Valid transitions: `PENDING` $\rightarrow$ `APPROVED` or `REJECTED`, and `APPROVED` $\rightarrow$ `COMPLETED`.
   - Invalid status transitions are rejected with HTTP 400.
3. **Role-Based Authorization**:
   - Backend middleware (`authenticate` + `authorize`) strictly guards all mutating endpoints.
   - Sellers can only edit/delete products they own.
   - Buyers can only view their own orders.
   - Only Admins can approve, reject, or complete orders.
4. **Historical Price Protection**:
   - `OrderItem.unitPrice` captures the price at the time of purchase so future product price updates do not alter past order totals.
5. **Multi-Tab Session Isolation**:
   - Uses `sessionStorage` so you can have an **Admin tab**, a **Seller tab**, and a **Buyer tab** open simultaneously without session collisions or overwrites.
6. **Live Real-Time Data Sync**:
   - Background polling (every 3 seconds) and automatic window-focus refetching keep data live across open tabs without requiring manual page refreshes.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Local or Supabase)

### 1. Backend Setup
```bash
cd backend
npm install
```

Configure `backend/.env`:
```env
DATABASE_URL="postgresql://postgres.mmsxqusjnouzqujedxgz:lwRspJ54nR8rvTdz@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="marketflow-super-secret-jwt-key-change-in-production"
PORT=5000
```

Push database schema and seed demo data:
```bash
npx prisma db push
npm run seed
```

Start backend development server:
```bash
npm run dev
# Running on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new Buyer or Seller account
- `POST /api/auth/login` — Login and receive JWT token

### Products
- `GET /api/products` — Get paginated products (supports `?search=`, `?category=`, `?page=`, `?limit=`)
- `GET /api/products/categories` — Get list of distinct product categories
- `GET /api/products/:id` — Get product by ID
- `POST /api/products` — *(Seller only)* Create a new product listing
- `PATCH /api/products/:id` — *(Seller only)* Update own product listing
- `DELETE /api/products/:id` — *(Seller only)* Delete own product listing

### Orders
- `POST /api/orders` — *(Buyer only)* Create order (validates stock & calculates price on server)
- `GET /api/orders/my-orders` — *(Buyer only)* Get logged-in buyer's orders
- `GET /api/orders/admin` — *(Admin only)* Get all orders (supports `?status=`)
- `GET /api/orders/admin/:id` — *(Admin only)* Get order details
- `PATCH /api/orders/admin/:id/approve` — *(Admin only)* Approve pending order
- `PATCH /api/orders/admin/:id/reject` — *(Admin only)* Reject pending order
- `PATCH /api/orders/admin/:id/complete` — *(Admin only)* Mark approved order as completed

### Users & Dashboard
- `GET /api/profile` — Get current authenticated user profile
- `GET /api/seller/stats` — *(Seller only)* Get seller product count, order count, and revenue
- `GET /api/admin/stats` — *(Admin only)* Get platform user count, product count, pending orders, and total orders
- `GET /api/admin/users` — *(Admin only)* Get list of all registered users
