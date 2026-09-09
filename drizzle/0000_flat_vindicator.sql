CREATE TABLE `community_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` text NOT NULL,
	`body` text NOT NULL,
	`image_url` text,
	`product_id` integer,
	`like_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_community_posts_created` ON `community_posts` (`created_at`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_favorites_user_product` ON `favorites` (`user_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`swap_request_id` integer NOT NULL,
	`sender_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_messages_swap_created` ON `messages` (`swap_request_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`swap_request_id` integer NOT NULL,
	`owner_id` text NOT NULL,
	`status` text DEFAULT 'awaiting_shipment' NOT NULL,
	`tracking_number` text,
	`logistics_text` text DEFAULT '等待双方发货' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_orders_swap_unique` ON `orders` (`swap_request_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_owner_status` ON `orders` (`owner_id`,`status`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`estimated_value` integer DEFAULT 0 NOT NULL,
	`condition` text NOT NULL,
	`image_url` text NOT NULL,
	`city` text DEFAULT '上海' NOT NULL,
	`desired_items` text DEFAULT '' NOT NULL,
	`accepts_swap` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_products_status_category` ON `products` (`status`,`category`);--> statement-breakpoint
CREATE INDEX `idx_products_owner_id` ON `products` (`owner_id`);--> statement-breakpoint
CREATE TABLE `swap_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`initiator_id` text NOT NULL,
	`target_product_id` integer NOT NULL,
	`offered_product_id` integer,
	`offered_title` text NOT NULL,
	`offered_image_url` text NOT NULL,
	`cash_adjustment` integer DEFAULT 0 NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`fulfillment_mode` text DEFAULT 'inspection' NOT NULL,
	`status` text DEFAULT 'negotiating' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_swap_requests_initiator` ON `swap_requests` (`initiator_id`);--> statement-breakpoint
CREATE INDEX `idx_swap_requests_target` ON `swap_requests` (`target_product_id`);--> statement-breakpoint
CREATE INDEX `idx_swap_requests_status` ON `swap_requests` (`status`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`city` text DEFAULT '上海' NOT NULL,
	`credit_score` integer DEFAULT 720 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
