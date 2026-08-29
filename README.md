# MarketFlow --- MVP Marketplace

A full-stack marketplace MVP built to demonstrate a complete marketplace
workflow with **Buyer, Seller, and Admin roles**, **JWT
authentication**, **REST APIs**, **PostgreSQL**, validation,
authorization, and a clean responsive UI.

The primary focus of this project is **functionality, architecture,
database design, API structure, security, and code quality**. The UI
should remain simple, clean, professional, and easy to use rather than
overly complex.

------------------------------------------------------------------------

## 1. Project Objective

The application implements the following end-to-end marketplace
workflow:

``` text
Seller Login
     ↓
Create Product Listing
     ↓
Buyer Login
     ↓
Browse Products
     ↓
View Product
     ↓
Place Order
     ↓
Order = PENDING
     ↓
Admin Login
     ↓
Approve / Reject Order
     ↓
APPROVED / REJECTED
     ↓
Complete Approved Order
     ↓
COMPLETED
```

### Main evaluation goals

-   Proper user role system
-   Buyer, Seller, and Admin authorization
-   Seller can create and manage listings
-   Buyer can browse products
-   Buyer can place orders
-   Admin can approve or reject orders
-   Clear order status flow
-   PostgreSQL database
-   REST API architecture
-   JWT authentication
-   Basic validation
-   Consistent error handling
-   Clean folder structure
-   Maintainable and reusable code
-   Working responsive UI

------------------------------------------------------------------------

# 2. User Roles

The system has three roles:

``` text
BUYER
SELLER
ADMIN
```

## Buyer

A buyer can:

-   Register/login
-   Browse products
-   Search products
-   View product details
-   Place an order
-   View their own orders
-   Track order status

A buyer cannot:

-   Create products
-   Modify another user's products
-   Approve orders
-   Reject orders
-   Complete orders

------------------------------------------------------------------------

## Seller

A seller can:

-   Register/login
-   View seller dashboard
-   Create product listings
-   View their own listings
-   Update their own listings
-   Delete their own listings
-   View relevant orders

A seller cannot:

-   Approve orders
-   Reject orders
-   Complete orders
-   Modify another seller's products

------------------------------------------------------------------------

## Admin

An admin can:

-   Login
-   View dashboard
-   View users
-   View products
-   View all orders
-   Filter orders by status
-   Approve pending orders
-   Reject pending orders
-   Complete approved orders

Admin accounts should be seeded or created through a protected process.
Public registration should not allow users to freely register as ADMIN.

------------------------------------------------------------------------

# 3. Order Status Flow

The order lifecycle is:

``` text
             ┌──────────────┐
             │    PENDING   │
             └──────┬───────┘
                    │
             ┌──────┴───────┐
             │              │
             ▼              ▼
      ┌────────────┐  ┌────────────┐
      │  APPROVED  │  │  REJECTED  │
      └─────┬──────┘  └────────────┘
            │
            ▼
      ┌────────────┐
      │ COMPLETED  │
      └────────────┘
```

### Valid transitions

``` text
PENDING → APPROVED
PENDING → REJECTED
APPROVED → COMPLETED
```

### Authorization

  Action                 Buyer   Seller      Admin
  -------------------- ------- -------- ----------
  Browse products          Yes      Yes        Yes
  Create listing            No      Yes   Optional
  Update own listing        No      Yes   Optional
  Delete own listing        No      Yes   Optional
  Place order              Yes       No         No
  View own orders          Yes       No         No
  View all orders           No       No        Yes
  Approve order             No       No        Yes
  Reject order              No       No        Yes
  Complete order            No       No        Yes

The buyer cannot change order status.

The seller cannot approve/reject orders.

Only authorized admin users can perform administrative order actions.

------------------------------------------------------------------------

# 4. UI Design Direction

The UI should be:

> **Simple + Clean + Professional + Functional**

The assessment explicitly states that design perfection is not the main
requirement, so the application should avoid unnecessary UI complexity.

### Design principles

1.  **Minimal**
    -   Avoid unnecessary borders, colors, and UI elements.
2.  **Professional**
    -   Use consistent spacing, typography, buttons, cards, and status
        badges.
3.  **Responsive**
    -   Support mobile, tablet, laptop, and desktop.
4.  **Interactive**
    -   Use simple hover states, loading states, toast messages, and
        confirmation dialogs.
5.  **Consistent**
    -   Reuse common components instead of creating different versions
        of the same UI.
6.  **Accessible**
    -   Use semantic HTML, proper labels, keyboard-friendly controls,
        and accessible buttons.

------------------------------------------------------------------------

# 5. Suggested UI Style

### Color system

``` text
Background       #F8FAFC
Surface          #FFFFFF
Primary Text     #18181B
Secondary Text   #71717A
Border           #E4E4E7
Primary          #18181B
Success          #16A34A
Warning          #D97706
Danger           #DC2626
```

### Typography

Recommended:

-   Geist
-   Inter
-   Manrope

Keep typography simple and consistent.

### UI characteristics

-   12--16px border radius
-   Subtle borders
-   Very light shadows
-   Good whitespace
-   Clear headings
-   Simple product cards
-   Clear status badges
-   Responsive navigation
-   Subtle animations around 150--250ms

Do not build an overly complicated Amazon-style interface.

------------------------------------------------------------------------

# 6. Buyer UI

The buyer homepage can follow this structure:

``` text
┌──────────────────────────────────────────────────────────────┐
│ MarketFlow       Products    My Orders       👤              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Find products you'll love                                    │
│ Browse products from independent sellers.                    │
│                                                              │
│ [ 🔍 Search products... ]                                    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Products                                                     │
│                                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │             │ │             │ │             │             │
│ │    IMAGE    │ │    IMAGE    │ │    IMAGE    │             │
│ │             │ │             │ │             │             │
│ ├─────────────┤ ├─────────────┤ ├─────────────┤             │
│ │ Headphones  │ │ Smart Watch │ │ Laptop      │             │
│ │ $99         │ │ $149        │ │ $899        │             │
│ │             │ │             │ │             │             │
│ │ [View]      │ │ [View]      │ │ [View]      │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

The buyer UI should prioritize product browsing and ordering.

------------------------------------------------------------------------

# 7. Seller Dashboard

``` text
┌──────────────────────────────────────────────────────────────┐
│ MarketFlow       Dashboard   My Listings   Orders      👤    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Seller Dashboard                                             │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│ │ Products   │ │ Orders     │ │ Revenue    │                 │
│ │ 24         │ │ 18         │ │ $4,820     │                 │
│ └────────────┘ └────────────┘ └────────────┘                 │
│                                                              │
│ My Listings                              [+ Add Product]     │
│                                                              │
│ Product          Price       Stock       Actions             │
│ ───────────────────────────────────────────────────────────  │
│ Headphones       $99         20          Edit  Delete        │
│ Keyboard         $79         15          Edit  Delete        │
│ Mouse            $49         40          Edit  Delete        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

The dashboard does not need complex analytics. Simple summary cards are
enough.

------------------------------------------------------------------------

# 8. Seller Create Listing

Seller clicks **Add Product**.

``` text
Create New Listing

Product name
[ MacBook Air M3                         ]

Description
[ ....................................... ]
[ ....................................... ]

Price
[ $ 999                               ]

Stock
[ 10                                  ]

Category
[ Electronics                       ▾ ]

Image URL
[ https://...                         ]

                    [ Cancel ] [ Create Listing ]
```

### Validation

-   Product name is required
-   Product name should have a reasonable minimum length
-   Description is required
-   Price must be greater than 0
-   Stock must be an integer \>= 0
-   Category is required
-   Image URL should be valid if provided

After creation:

``` text
✓ Product created successfully
```

------------------------------------------------------------------------

# 9. Buyer Product Details

``` text
┌──────────────────────────┬───────────────────────────────────┐
│                          │                                   │
│                          │  MacBook Air M3                   │
│       PRODUCT IMAGE      │                                   │
│                          │  $999                              │
│                          │                                   │
│                          │  In stock: 10                     │
│                          │                                   │
│                          │  Powerful laptop...               │
│                          │                                   │
│                          │  Quantity  [-] 1 [+]              │
│                          │                                   │
│                          │  [ Place Order ]                  │
│                          │                                   │
└──────────────────────────┴───────────────────────────────────┘
```

The product page should show:

-   Product image
-   Product name
-   Description
-   Price
-   Available stock
-   Seller information if appropriate
-   Quantity
-   Place Order button

------------------------------------------------------------------------

# 10. Place Order

When the buyer clicks **Place Order**, show a confirmation dialog.

``` text
Confirm Order

MacBook Air M3

Quantity       1
Price          $999
Total          $999

This order will be sent to the
admin for approval.

[ Cancel ]       [ Confirm Order ]
```

After confirmation:

``` text
✓ Order placed successfully
```

The new order starts with:

``` text
PENDING
```

------------------------------------------------------------------------

# 11. Buyer Orders

Buyer navigation:

``` text
My Orders
```

Example:

``` text
My Orders

┌──────────────────────────────────────────────────────────────┐
│ Order #ORD-1001                                              │
│ MacBook Air M3                                                │
│ Quantity: 1                                                  │
│ Total: $999                                                   │
│                                                              │
│ Status: PENDING                                              │
│                                                              │
│ Created: Aug 29, 2026                                        │
└──────────────────────────────────────────────────────────────┘
```

Status badges:

``` text
PENDING       🟡
APPROVED      🟢
REJECTED      🔴
COMPLETED     🔵
```

------------------------------------------------------------------------

# 12. Admin Dashboard

``` text
┌──────────────────────────────────────────────────────────────┐
│ MarketFlow Admin       Dashboard   Orders   Users   Products │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Dashboard                                                    │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Users      │ │ Products   │ │ Pending    │ │ Orders     │ │
│ │ 142        │ │ 87         │ │ 12         │ │ 58         │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│                                                              │
│ Pending Orders                                               │
│                                                              │
│ Order       Buyer       Product       Amount      Status     │
│ ───────────────────────────────────────────────────────────  │
│ #1001       Rahul       MacBook       $999        Pending    │
│ #1002       Amit        Headphones    $99         Pending    │
│                                                              │
│                              [View] [Approve] [Reject]       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 13. Admin Order Details

``` text
Order #ORD-1001

Buyer
Rahul Kumar
rahul@email.com

Product
MacBook Air M3

Seller
John Store

Quantity
1

Total
$999

Current Status

PENDING

[ Approve Order ]     [ Reject Order ]
```

After approval:

``` text
PENDING
   ↓
APPROVED
   ↓
COMPLETED
```

------------------------------------------------------------------------

# 14. Recommended Tech Stack

## Frontend

``` text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
TanStack Query
React Hook Form
Zod
Lucide React
```

## Backend

``` text
Node.js
Express.js
TypeScript
Prisma
PostgreSQL
Zod
JWT
bcrypt
```

## Architecture

``` text
Next.js Frontend
       │
       │ REST / JSON
       ▼
Express.js API
       │
       ▼
Prisma
       │
       ▼
PostgreSQL
```

------------------------------------------------------------------------

# 15. Project Structure

Recommended monorepo structure:

``` text
marketflow/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   │
│   │   ├── seller/
│   │   │   ├── page.tsx
│   │   │   └── products/
│   │   │       ├── page.tsx
│   │   │       └── create/
│   │   │           └── page.tsx
│   │   │
│   │   └── admin/
│   │       ├── page.tsx
│   │       └── orders/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── seller/
│   │   ├── admin/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   │
│   ├── store/
│   │   └── auth-store.ts
│   │
│   ├── hooks/
│   │   └── use-auth.ts
│   │
│   └── types/
│       ├── user.ts
│       ├── product.ts
│       └── order.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   └── user.controller.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   └── user.routes.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   └── order.service.ts
│   │   │
│   │   ├── repositories/
│   │   │   ├── user.repository.ts
│   │   │   ├── product.repository.ts
│   │   │   └── order.repository.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   ├── product.validator.ts
│   │   │   └── order.validator.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── password.ts
│   │   │
│   │   └── app.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

------------------------------------------------------------------------

# 16. PostgreSQL Database Design

The database should be normalized and designed around the marketplace
workflow.

Core tables:

``` text
users
products
orders
order_items
```

------------------------------------------------------------------------

## Users

``` text
users
────────────────────────
id              UUID PK
name            VARCHAR
email           VARCHAR UNIQUE
password_hash   VARCHAR
role            ENUM
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

Role:

``` text
BUYER
SELLER
ADMIN
```

------------------------------------------------------------------------

## Products

``` text
products
────────────────────────
id              UUID PK
seller_id       UUID FK
name            VARCHAR
description     TEXT
price           DECIMAL
stock           INTEGER
category        VARCHAR
image_url       TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

Relationship:

``` text
users 1 ───────── * products
```

A seller can have many products.

------------------------------------------------------------------------

## Orders

``` text
orders
────────────────────────
id              UUID PK
buyer_id        UUID FK
status          ENUM
total_amount    DECIMAL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

------------------------------------------------------------------------

## Order Items

``` text
order_items
────────────────────────
id              UUID PK
order_id        UUID FK
product_id      UUID FK
seller_id       UUID FK
quantity        INTEGER
unit_price      DECIMAL
subtotal        DECIMAL
```

Relationships:

``` text
users 1 ───────── * orders

orders 1 ──────── * order_items

products 1 ────── * order_items

users 1 ───────── * products
```

------------------------------------------------------------------------

# 17. Why Store unit_price?

Order items should store the price at the time of purchase.

Example:

``` text
Current product price = $1099

Buyer purchased product = $899

Later seller changes price = $1199
```

The old order must still show:

``` text
$899
```

Therefore:

``` text
order_items.unit_price
```

should be stored.

Do not calculate historical order totals using the current product
price.

------------------------------------------------------------------------

# 18. Authentication

Authentication uses:

``` text
JWT
+
bcrypt
```

Login flow:

``` text
User enters email/password
        ↓
Backend validates credentials
        ↓
Compare password with bcrypt hash
        ↓
Generate JWT
        ↓
Return authentication response
        ↓
Frontend stores auth state
        ↓
Protected API requests include JWT
```

Protected requests:

``` http
Authorization: Bearer <token>
```

JWT payload should contain enough information for authorization, such
as:

``` json
{
  "sub": "user-id",
  "role": "SELLER"
}
```

Never store plain-text passwords.

------------------------------------------------------------------------

# 19. Authorization Middleware

Use two middleware layers:

``` text
authenticate()
authorize()
```

Conceptually:

``` text
Request
  ↓
authenticate()
  ↓
Validate JWT
  ↓
Attach user to request
  ↓
authorize("ADMIN")
  ↓
Controller
```

Examples:

``` text
POST /api/products
authenticate()
authorize("SELLER")
```

``` text
PATCH /api/admin/orders/:id/approve
authenticate()
authorize("ADMIN")
```

This ensures role-based access control is enforced on the backend rather
than only hiding UI elements.

------------------------------------------------------------------------

# 20. REST API Structure

Base URL:

``` text
/api
```

------------------------------------------------------------------------

## Authentication

### Register

``` http
POST /api/auth/register
```

Request:

``` json
{
  "name": "John",
  "email": "john@example.com",
  "password": "Password123",
  "role": "SELLER"
}
```

Public registration should only allow:

``` text
BUYER
SELLER
```

Admin should be seeded or provisioned securely.

------------------------------------------------------------------------

### Login

``` http
POST /api/auth/login
```

Response:

``` json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John",
      "email": "john@example.com",
      "role": "SELLER"
    },
    "token": "jwt-token"
  }
}
```

------------------------------------------------------------------------

# 21. Product APIs

### Get products

``` http
GET /api/products
```

Optional query parameters:

``` text
/api/products?page=1&limit=12
/api/products?search=phone
/api/products?category=electronics
```

### Get product

``` http
GET /api/products/:id
```

### Create product

``` http
POST /api/products
```

Authorization:

``` text
SELLER
```

### Update product

``` http
PATCH /api/products/:id
```

Authorization:

``` text
SELLER
```

The seller must own the product.

### Delete product

``` http
DELETE /api/products/:id
```

Authorization:

``` text
SELLER
```

The seller must own the product.

------------------------------------------------------------------------

# 22. Order APIs

### Create order

``` http
POST /api/orders
```

Authorization:

``` text
BUYER
```

Request:

``` json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

The backend must calculate the total using database prices.

Never trust a price sent by the frontend.

------------------------------------------------------------------------

### Buyer orders

``` http
GET /api/orders/my-orders
```

Authorization:

``` text
BUYER
```

The response should contain only the logged-in buyer's orders.

------------------------------------------------------------------------

### Admin orders

``` http
GET /api/admin/orders
```

Authorization:

``` text
ADMIN
```

Optional:

``` http
GET /api/admin/orders?status=PENDING
```

------------------------------------------------------------------------

### Approve order

``` http
PATCH /api/admin/orders/:id/approve
```

Authorization:

``` text
ADMIN
```

Transition:

``` text
PENDING → APPROVED
```

------------------------------------------------------------------------

### Reject order

``` http
PATCH /api/admin/orders/:id/reject
```

Authorization:

``` text
ADMIN
```

Transition:

``` text
PENDING → REJECTED
```

------------------------------------------------------------------------

### Complete order

``` http
PATCH /api/admin/orders/:id/complete
```

Authorization:

``` text
ADMIN
```

Transition:

``` text
APPROVED → COMPLETED
```

------------------------------------------------------------------------

# 23. API Response Format

Use a consistent API response structure.

### Success

``` json
{
  "success": true,
  "data": {}
}
```

### Error

``` json
{
  "success": false,
  "message": "Product not found"
}
```

### Validation error

``` json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "price": "Price must be greater than 0"
  }
}
```

Use centralized error handling so controllers do not each implement
different error formats.

------------------------------------------------------------------------

# 24. Validation

Use **Zod** for request validation.

## Product validation

``` text
name
  required

description
  required

price
  number > 0

stock
  integer >= 0

category
  required
```

## Order validation

``` text
productId
  valid UUID

quantity
  integer > 0
```

Validation should happen before business logic.

------------------------------------------------------------------------

# 25. Order Creation Transaction

Creating an order should be handled using a database transaction.

Conceptually:

``` text
BEGIN TRANSACTION

1. Fetch product
2. Lock/check product stock
3. Verify requested quantity
4. Read current product price
5. Calculate subtotal
6. Create order
7. Create order_items
8. Decrease product stock

COMMIT
```

If anything fails:

``` text
ROLLBACK
```

This prevents inconsistent data such as:

``` text
Order created
BUT
Stock was not updated
```

------------------------------------------------------------------------

# 26. Stock Management

Example:

``` text
Product stock = 5

Buyer orders quantity = 2

New stock = 3
```

The backend must verify stock before creating the order.

For concurrent orders, use a PostgreSQL transaction/row-locking strategy
so two buyers cannot incorrectly purchase the same final inventory.

Conceptually:

``` sql
SELECT *
FROM products
WHERE id = $1
FOR UPDATE;
```

Then:

``` text
Check stock
   ↓
Update stock
   ↓
Create order
```

------------------------------------------------------------------------

# 27. Search

Search is optional compared with the core marketplace workflow, but it
improves usability.

Example:

``` http
GET /api/products?search=phone
```

On the frontend, use a debounce of approximately:

``` text
300–500ms
```

Recommended:

``` text
400ms
```

Flow:

``` text
User types
    ↓
searchTerm
    ↓
wait 400ms
    ↓
debouncedSearchTerm
    ↓
API request
```

Do not send an API request for every individual keystroke.

------------------------------------------------------------------------

# 28. Frontend State Management

Use **TanStack Query** for server/API state:

``` text
Products
Orders
Product details
Users
```

Use lightweight client state only where required.

Example:

``` text
TanStack Query
      ↓
Server State

React state / small store
      ↓
UI State
```

Authentication state can be managed using a dedicated auth store/context
depending on the implementation.

Do not put all API data into global state unnecessarily.

------------------------------------------------------------------------

# 29. Loading States

Every API-driven screen should have a loading state.

Use skeleton UI instead of leaving the screen blank.

Example:

``` text
┌──────────────┐
│ ░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░ │
├──────────────┤
│ ░░░░░░░░░░░░ │
│ ░░░░░░░       │
└──────────────┘
```

Required areas:

-   Product listing
-   Product details
-   Seller listings
-   Orders
-   Admin orders
-   Dashboard statistics

------------------------------------------------------------------------

# 30. Error States

Use user-friendly messages.

Example:

``` text
Something went wrong

We couldn't load the products.

[ Try Again ]
```

Avoid showing raw errors such as:

``` text
PrismaClientKnownRequestError
AxiosError
JWT malformed
```

to the end user.

Log technical errors appropriately on the server.

------------------------------------------------------------------------

# 31. Empty States

### Empty products

``` text
No products found

Try changing your search or filters.
```

### Empty orders

``` text
No orders yet

Start shopping to see your orders here.

[ Browse Products ]
```

### No seller listings

``` text
You haven't created any listings yet.

[ Create Listing ]
```

### No pending admin orders

``` text
You're all caught up.

There are no pending orders.
```

------------------------------------------------------------------------

# 32. Responsive Design

The application must work on:

``` text
Mobile
Tablet
Laptop
Desktop
```

Suggested product grid:

``` text
Mobile       2 columns
Tablet       3 columns
Desktop      4 columns
```

Navigation should collapse appropriately on mobile.

Tables on admin/seller pages should become horizontally scrollable or
transform into responsive cards.

------------------------------------------------------------------------

# 33. Security Requirements

Implement at least:

-   Password hashing with bcrypt
-   JWT authentication
-   Role-based authorization
-   Ownership checks for seller products
-   Input validation
-   Backend-side price calculation
-   Backend-side stock validation
-   Parameterized database access through Prisma
-   No plain-text passwords
-   No secret keys committed to Git
-   Environment variables for sensitive configuration

Example:

``` env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=5000
```

Never commit the real `.env` file.

------------------------------------------------------------------------

# 34. What NOT to Build

This is an MVP.

Do not spend most of the development time on:

-   Payment gateway
-   Real-time chat
-   Complex recommendation engine
-   Coupons
-   Reviews
-   Shipping integrations
-   Advanced seller verification
-   Complex analytics
-   Elaborate animations
-   Large design system

Focus on:

``` text
Authentication
      ↓
Roles
      ↓
Products
      ↓
Orders
      ↓
Admin Approval
      ↓
Order Completion
```

------------------------------------------------------------------------

# 35. Recommended Pages

## Public

``` text
/login
/register
/products
/products/:id
```

## Buyer

``` text
/orders
```

## Seller

``` text
/seller
/seller/products
/seller/products/create
```

## Admin

``` text
/admin
/admin/orders
```

This is enough for the MVP.

------------------------------------------------------------------------

# 36. Role-Based Navigation

## Buyer

``` text
MarketFlow
Products
My Orders
Profile
Logout
```

## Seller

``` text
MarketFlow
Dashboard
My Listings
Orders
Profile
Logout
```

## Admin

``` text
MarketFlow
Dashboard
Orders
Users
Products
Logout
```

Do not rely only on hiding navigation links for security. Backend
authorization must enforce permissions.

------------------------------------------------------------------------

# 37. Frontend Components

Recommended reusable components:

``` text
components/
├── layout/
│   ├── Header
│   ├── Sidebar
│   └── MobileNavigation
│
├── products/
│   ├── ProductCard
│   ├── ProductGrid
│   ├── ProductDetails
│   ├── ProductForm
│   └── ProductFilters
│
├── orders/
│   ├── OrderCard
│   ├── OrderTable
│   ├── OrderStatusBadge
│   └── OrderDetails
│
├── seller/
│   ├── SellerStats
│   └── ListingTable
│
├── admin/
│   ├── AdminStats
│   ├── AdminOrderTable
│   └── OrderActions
│
└── common/
    ├── Loading
    ├── EmptyState
    ├── ErrorState
    └── ConfirmDialog
```

------------------------------------------------------------------------

# 38. Code Quality Rules

### 1. Avoid `any`

Prefer proper TypeScript types.

``` tsx
// Avoid
const product: any = ...

// Prefer
const product: Product = ...
```

### 2. Keep API logic separate

Avoid putting API calls directly throughout UI components.

Prefer:

``` text
API layer
   ↓
Service
   ↓
React Query
   ↓
Component
```

### 3. Keep controllers thin

Recommended:

``` text
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Repository / Prisma
 ↓
Database
```

### 4. Reuse components

Do not create five different status badges when one reusable component
is enough.

### 5. Keep business logic out of UI

Order calculations, stock checks, permissions, and status transitions
belong on the backend.

------------------------------------------------------------------------

# 39. Backend Request Flow

Example: Buyer creates an order.

``` text
POST /api/orders
       ↓
JWT Middleware
       ↓
Role Middleware
       ↓
Zod Validation
       ↓
Order Controller
       ↓
Order Service
       ↓
Prisma Transaction
       ↓
PostgreSQL
       ↓
Response
```

This should be the general pattern throughout the backend.

------------------------------------------------------------------------

# 40. Example Complete Workflow

## Step 1 --- Seller

Login:

``` text
seller@example.com
```

Create:

``` text
MacBook Air M3
Price: $999
Stock: 5
Category: Electronics
```

------------------------------------------------------------------------

## Step 2 --- Buyer

Login:

``` text
buyer@example.com
```

Browse products.

Open:

``` text
MacBook Air M3
```

Click:

``` text
Place Order
```

Order becomes:

``` text
PENDING
```

------------------------------------------------------------------------

## Step 3 --- Admin

Login:

``` text
admin@example.com
```

Open:

``` text
Pending Orders
```

Find:

``` text
ORD-001
MacBook Air M3
Buyer: buyer@example.com
Amount: $999
```

Click:

``` text
Approve
```

Status:

``` text
APPROVED
```

------------------------------------------------------------------------

## Step 4 --- Complete

Admin clicks:

``` text
Complete Order
```

Status:

``` text
COMPLETED
```

Buyer now sees:

``` text
ORD-001
COMPLETED
```

This demonstrates the complete marketplace workflow.

------------------------------------------------------------------------

# 41. Development Order

Implement the project in this order.

## Phase 1 --- Project Setup

-   [ ] Create frontend
-   [ ] Create backend
-   [ ] Configure TypeScript
-   [ ] Configure PostgreSQL
-   [ ] Configure Prisma
-   [ ] Configure environment variables

## Phase 2 --- Database

-   [ ] Create User model
-   [ ] Create Product model
-   [ ] Create Order model
-   [ ] Create OrderItem model
-   [ ] Create enums
-   [ ] Create relationships
-   [ ] Run migrations
-   [ ] Seed admin user

## Phase 3 --- Authentication

-   [ ] Register
-   [ ] Login
-   [ ] Password hashing
-   [ ] JWT generation
-   [ ] JWT middleware
-   [ ] Role middleware

## Phase 4 --- Products

-   [ ] Create product
-   [ ] Get products
-   [ ] Get product by ID
-   [ ] Update product
-   [ ] Delete product
-   [ ] Seller ownership checks
-   [ ] Search/filter

## Phase 5 --- Orders

-   [ ] Create order
-   [ ] Stock validation
-   [ ] Price calculation
-   [ ] Transaction
-   [ ] Buyer order history
-   [ ] Order status

## Phase 6 --- Admin

-   [ ] Admin dashboard
-   [ ] View orders
-   [ ] Pending orders
-   [ ] Approve
-   [ ] Reject
-   [ ] Complete

## Phase 7 --- UI

-   [ ] Header
-   [ ] Product grid
-   [ ] Product details
-   [ ] Seller dashboard
-   [ ] Create listing form
-   [ ] Buyer orders
-   [ ] Admin dashboard
-   [ ] Status badges
-   [ ] Loading states
-   [ ] Error states
-   [ ] Empty states

## Phase 8 --- Final Testing

-   [ ] Test all roles
-   [ ] Test protected routes
-   [ ] Test invalid JWT
-   [ ] Test product ownership
-   [ ] Test stock
-   [ ] Test order transitions
-   [ ] Test validation
-   [ ] Test responsive UI
-   [ ] Test production build

------------------------------------------------------------------------

# 42. Testing Checklist

## Authentication

-   [ ] Register buyer
-   [ ] Register seller
-   [ ] Login
-   [ ] Invalid password
-   [ ] Invalid email
-   [ ] Password is hashed
-   [ ] JWT generated
-   [ ] Protected endpoints reject unauthenticated requests

## Authorization

-   [ ] Buyer cannot create product
-   [ ] Seller cannot approve order
-   [ ] Seller cannot modify another seller's product
-   [ ] Buyer cannot approve order
-   [ ] Admin can manage orders

## Products

-   [ ] Seller creates product
-   [ ] Product appears for buyers
-   [ ] Product details work
-   [ ] Seller can edit own product
-   [ ] Seller can delete own product
-   [ ] Search works
-   [ ] Validation works

## Orders

-   [ ] Buyer creates order
-   [ ] Initial status is PENDING
-   [ ] Stock decreases correctly
-   [ ] Correct price is stored
-   [ ] Buyer can see own orders
-   [ ] Admin can see all orders
-   [ ] Admin can approve
-   [ ] Admin can reject
-   [ ] Admin can complete approved order
-   [ ] Invalid status transitions are rejected

## UI

-   [ ] Loading state
-   [ ] Error state
-   [ ] Empty state
-   [ ] Toast feedback
-   [ ] Responsive layout
-   [ ] Mobile navigation
-   [ ] Accessible buttons/forms

------------------------------------------------------------------------

# 43. Environment Variables

## Backend

Create:

``` text
backend/.env
```

Example:

``` env
DATABASE_URL="postgresql://postgres:password@localhost:5432/marketflow"
JWT_SECRET="replace-with-a-secure-secret"
PORT=5000
```

## Frontend

Create:

``` text
frontend/.env.local
```

Example:

``` env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Do not commit real secrets.

------------------------------------------------------------------------

# 44. Local Development

## Backend

``` bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend:

``` text
http://localhost:5000
```

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

Frontend:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 45. Suggested npm Dependencies

## Frontend

``` bash
npm install @tanstack/react-query react-hook-form zod @hookform/resolvers lucide-react
```

Install shadcn/ui components as needed.

## Backend

``` bash
npm install express cors dotenv bcrypt jsonwebtoken zod @prisma/client
```

Development dependencies:

``` bash
npm install -D typescript tsx prisma @types/express @types/cors @types/bcrypt @types/jsonwebtoken
```

------------------------------------------------------------------------

# 46. Recommended API Naming

Use consistent REST naming.

Good:

``` text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

POST   /api/orders
GET    /api/orders/my-orders

GET    /api/admin/orders
PATCH  /api/admin/orders/:id/approve
PATCH  /api/admin/orders/:id/reject
PATCH  /api/admin/orders/:id/complete
```

Avoid inconsistent naming such as:

``` text
/getProducts
/createNewProduct
/doApproveOrder
```

------------------------------------------------------------------------

# 47. Important Business Rules

These rules must be enforced on the backend.

### Product ownership

Seller can only update/delete products they own.

``` text
product.seller_id === loggedInUser.id
```

### Order ownership

Buyer can only view their own orders.

``` text
order.buyer_id === loggedInUser.id
```

### Admin authorization

Only ADMIN can approve/reject/complete orders.

### Price

Price comes from PostgreSQL, not from the frontend.

### Stock

Stock comes from PostgreSQL and must be validated before ordering.

### Status

Only valid status transitions are allowed.

------------------------------------------------------------------------

# 48. MVP Scope

The MVP should contain:

### Required

-   [x] Buyer role
-   [x] Seller role
-   [x] Admin role
-   [x] JWT authentication
-   [x] PostgreSQL
-   [x] Seller listing creation
-   [x] Product browsing
-   [x] Buyer order creation
-   [x] Admin approval
-   [x] Admin rejection
-   [x] Order completion
-   [x] Order status
-   [x] Validation
-   [x] Error handling
-   [x] REST APIs
-   [x] Responsive UI

### Nice to have

-   [ ] Search
-   [ ] Pagination
-   [ ] Sorting
-   [ ] Product categories
-   [ ] Toast notifications
-   [ ] Dashboard statistics

### Not required

-   [ ] Payments
-   [ ] Coupons
-   [ ] Reviews
-   [ ] Chat
-   [ ] Shipping integration
-   [ ] Advanced analytics

------------------------------------------------------------------------

# 49. Assessment Demo Plan

During the final demo, demonstrate the actual workflow instead of only
showing individual screens.

### Demo 1 --- Seller

``` text
Login as Seller
       ↓
Open Seller Dashboard
       ↓
Create Product
       ↓
Show product listing
```

### Demo 2 --- Buyer

``` text
Logout
       ↓
Login as Buyer
       ↓
Browse Product
       ↓
Open Product Details
       ↓
Place Order
       ↓
Show PENDING status
```

### Demo 3 --- Admin

``` text
Logout
       ↓
Login as Admin
       ↓
Open Orders
       ↓
Filter PENDING
       ↓
Approve Order
       ↓
Show APPROVED
       ↓
Complete Order
       ↓
Show COMPLETED
```

This demonstrates almost the entire assessment requirement in one flow.

------------------------------------------------------------------------

# 50. Final Architecture

``` text
                         ┌─────────────────────┐
                         │      Next.js        │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                              REST / JSON
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Express.js      │
                         │       REST API      │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
                Auth            Products           Orders
                   │                │                │
                   └────────────────┼────────────────┘
                                    │
                                    ▼
                              ┌───────────┐
                              │  Prisma   │
                              └─────┬─────┘
                                    │
                                    ▼
                              ┌───────────┐
                              │PostgreSQL │
                              └───────────┘
```

------------------------------------------------------------------------

# 51. Final Quality Target

The project should communicate three things immediately:

``` text
1. The developer understands role-based marketplace workflows.

2. The developer understands backend architecture,
   REST APIs, PostgreSQL, transactions, validation and JWT.

3. The developer can build a clean, usable frontend
   without over-engineering the UI.
```

The priority should be:

``` text
Architecture
    ↓
Database Design
    ↓
Authentication & Authorization
    ↓
Order Workflow
    ↓
API Quality
    ↓
Validation & Error Handling
    ↓
Clean UI
```

The UI should support the functionality, not become the main project.

------------------------------------------------------------------------

# 52. Definition of Done

The project is complete when the following scenario works from start to
finish:

``` text
Seller
  ↓
Login
  ↓
Create listing
  ↓
Product becomes available
  ↓
Buyer
  ↓
Login
  ↓
Browse product
  ↓
Place order
  ↓
PENDING
  ↓
Admin
  ↓
Login
  ↓
View pending order
  ↓
Approve
  ↓
APPROVED
  ↓
Complete
  ↓
COMPLETED
  ↓
Buyer sees updated status
```

If this flow works reliably, the core MVP is complete.
