ALTER TABLE `products` ADD `track_stock` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `list_price_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `description_status` text DEFAULT 'owner' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `needs_review` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `seo_title` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `seo_description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `archived` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `updated_by_admin` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `import_snapshot` text DEFAULT '' NOT NULL;