import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash passwords
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const sellerPassword = await bcrypt.hash("Seller123!", 10);
  const buyerPassword = await bcrypt.hash("Buyer123!", 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@marketflow.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@marketflow.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create Seller
  const seller = await prisma.user.upsert({
    where: { email: "seller@example.com" },
    update: {},
    create: {
      name: "John Store",
      email: "seller@example.com",
      passwordHash: sellerPassword,
      role: Role.SELLER,
    },
  });
  console.log(`✅ Seller created: ${seller.email}`);

  // Create Buyer
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      name: "Rahul Kumar",
      email: "buyer@example.com",
      passwordHash: buyerPassword,
      role: Role.BUYER,
    },
  });
  console.log(`✅ Buyer created: ${buyer.email}`);

  // Create sample products only if none exist
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "MacBook Air M3",
          description:
            "Powerful laptop with Apple M3 chip, 16GB RAM, and 512GB SSD. Perfect for professionals and creatives who need performance on the go.",
          price: 999,
          stock: 5,
          category: "Electronics",
          imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
          sellerId: seller.id,
        },
        {
          name: "Wireless Headphones",
          description:
            "Premium noise-cancelling wireless headphones with 30-hour battery life. Experience crystal-clear audio with deep bass.",
          price: 99,
          stock: 20,
          category: "Electronics",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
          sellerId: seller.id,
        },
        {
          name: "Smart Watch Pro",
          description:
            "Advanced smartwatch with health monitoring, GPS tracking, and 5-day battery life. Stay connected and track your fitness goals.",
          price: 149,
          stock: 15,
          category: "Electronics",
          imageUrl: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600",
          sellerId: seller.id,
        },
        {
          name: "Mechanical Keyboard",
          description:
            "RGB mechanical keyboard with Cherry MX Blue switches. Tactile feedback and customizable lighting for the ultimate typing experience.",
          price: 79,
          stock: 25,
          category: "Electronics",
          imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
          sellerId: seller.id,
        },
        {
          name: "Ergonomic Mouse",
          description:
            "Wireless ergonomic mouse designed for comfort during long work sessions. Features adjustable DPI and silent clicks.",
          price: 49,
          stock: 40,
          category: "Electronics",
          imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
          sellerId: seller.id,
        },
        {
          name: "4K Monitor",
          description:
            "27-inch 4K UHD monitor with IPS panel, HDR support, and USB-C connectivity. Perfect for creative professionals.",
          price: 449,
          stock: 8,
          category: "Electronics",
          imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
          sellerId: seller.id,
        },
      ],
    });
    console.log("✅ 6 sample products created");
  } else {
    console.log(`ℹ️  Products already exist (${existingProducts}), skipping`);
  }

  console.log("\n🎉 Seeding complete!\n");
  console.log("Demo accounts:");
  console.log("  Admin:  admin@marketflow.com  / Admin123!");
  console.log("  Seller: seller@example.com    / Seller123!");
  console.log("  Buyer:  buyer@example.com     / Buyer123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
