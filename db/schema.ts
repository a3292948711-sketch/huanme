import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  city: text("city").notNull().default("上海"),
  creditScore: integer("credit_score").notNull().default(720),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ownerId: text("owner_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    category: text("category").notNull(),
    price: integer("price").notNull().default(0),
    estimatedValue: integer("estimated_value").notNull().default(0),
    condition: text("condition").notNull(),
    imageUrl: text("image_url").notNull(),
    city: text("city").notNull().default("上海"),
    desiredItems: text("desired_items").notNull().default(""),
    acceptsSwap: integer("accepts_swap", { mode: "boolean" })
      .notNull()
      .default(true),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_products_status_category").on(table.status, table.category),
    index("idx_products_owner_id").on(table.ownerId),
  ],
);

export const swapRequests = sqliteTable(
  "swap_requests",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    initiatorId: text("initiator_id").notNull(),
    targetProductId: integer("target_product_id").notNull(),
    offeredProductId: integer("offered_product_id"),
    offeredTitle: text("offered_title").notNull(),
    offeredImageUrl: text("offered_image_url").notNull(),
    cashAdjustment: integer("cash_adjustment").notNull().default(0),
    note: text("note").notNull().default(""),
    fulfillmentMode: text("fulfillment_mode").notNull().default("inspection"),
    status: text("status").notNull().default("negotiating"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_swap_requests_initiator").on(table.initiatorId),
    index("idx_swap_requests_target").on(table.targetProductId),
    index("idx_swap_requests_status").on(table.status),
  ],
);

export const messages = sqliteTable(
  "messages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    swapRequestId: integer("swap_request_id").notNull(),
    senderId: text("sender_id").notNull(),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_messages_swap_created").on(table.swapRequestId, table.createdAt)],
);

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    swapRequestId: integer("swap_request_id").notNull(),
    ownerId: text("owner_id").notNull(),
    status: text("status").notNull().default("awaiting_shipment"),
    trackingNumber: text("tracking_number"),
    logisticsText: text("logistics_text").notNull().default("等待双方发货"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_orders_swap_unique").on(table.swapRequestId),
    index("idx_orders_owner_status").on(table.ownerId, table.status),
  ],
);

export const favorites = sqliteTable(
  "favorites",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    productId: integer("product_id").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_favorites_user_product").on(table.userId, table.productId),
  ],
);

export const communityPosts = sqliteTable(
  "community_posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    authorId: text("author_id").notNull(),
    body: text("body").notNull(),
    imageUrl: text("image_url"),
    productId: integer("product_id"),
    likeCount: integer("like_count").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_community_posts_created").on(table.createdAt)],
);
