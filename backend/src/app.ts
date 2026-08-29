import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";

// Import routes
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Enable CORS for all vercel.app domains, localhost, and custom origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any localhost, 127.0.0.1, or *.vercel.app domain (including preview URLs)
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".vercel.app") ||
        origin === "https://mini-marketplace-mvp.vercel.app" ||
        origin === "https://mini-marketplace-mvp-2281.vercel.app"
      ) {
        return callback(null, true);
      }

      // Default allow
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "MarketFlow API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", userRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`\n🚀 MarketFlow API running on http://localhost:${env.PORT}`);
  console.log(`   Health: http://localhost:${env.PORT}/api/health\n`);
});

export default app;
