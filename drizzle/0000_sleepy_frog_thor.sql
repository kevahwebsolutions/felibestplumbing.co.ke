CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `daily_stats` (
	`day` text PRIMARY KEY NOT NULL,
	`visitors` integer DEFAULT 0 NOT NULL,
	`sessions` integer DEFAULT 0 NOT NULL,
	`pageviews` integer DEFAULT 0 NOT NULL,
	`bounces` integer DEFAULT 0 NOT NULL,
	`orders` integer DEFAULT 0 NOT NULL,
	`revenue` integer DEFAULT 0 NOT NULL,
	`calls` integer DEFAULT 0 NOT NULL,
	`whatsapp` integer DEFAULT 0 NOT NULL,
	`forms` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_stats_day_idx` ON `daily_stats` (`day`);--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text DEFAULT 'enquiry' NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`service` text DEFAULT '' NOT NULL,
	`preferred_date` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`forwarded` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `enquiries` (`status`);--> statement-breakpoint
CREATE INDEX `enquiries_created_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ts` integer NOT NULL,
	`day` text NOT NULL,
	`hour` integer NOT NULL,
	`weekday` integer NOT NULL,
	`visitor_id` text NOT NULL,
	`session_id` text NOT NULL,
	`type` text NOT NULL,
	`path` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'direct' NOT NULL,
	`device` text DEFAULT 'desktop' NOT NULL,
	`browser` text DEFAULT 'Other' NOT NULL,
	`os` text DEFAULT 'Other' NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`product_id` integer,
	`value` integer
);
--> statement-breakpoint
CREATE INDEX `events_ts_idx` ON `events` (`ts`);--> statement-breakpoint
CREATE INDEX `events_day_type_idx` ON `events` (`day`,`type`);--> statement-breakpoint
CREATE INDEX `events_type_product_idx` ON `events` (`type`,`product_id`);--> statement-breakpoint
CREATE INDEX `events_session_idx` ON `events` (`session_id`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer,
	`name` text NOT NULL,
	`sku` text DEFAULT '' NOT NULL,
	`price` integer NOT NULL,
	`qty` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ref` text NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`area` text NOT NULL,
	`address` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`payment_method` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`subtotal` integer NOT NULL,
	`delivery_fee` integer DEFAULT 0 NOT NULL,
	`total` integer NOT NULL,
	`internal_notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_ref_unique` ON `orders` (`ref`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_created_idx` ON `orders` (`created_at`);--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`src` text NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_images_product_idx` ON `product_images` (`product_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category_id` integer,
	`description` text DEFAULT '' NOT NULL,
	`price` integer NOT NULL,
	`sale_price` integer,
	`sku` text DEFAULT '' NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`specs` text DEFAULT '[]' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`is_new` integer DEFAULT false NOT NULL,
	`is_placeholder_price` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `products_published_idx` ON `products` (`published`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`must_change_password` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);