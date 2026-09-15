CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`full_name` text,
	`role` text DEFAULT 'member' NOT NULL,
	`semester_key` text NOT NULL,
	`valid_from` text NOT NULL,
	`valid_until` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`authenticated_user_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_members_email_semester` ON `members` (`email`,`semester_key`);--> statement-breakpoint
CREATE INDEX `idx_members_semester_active` ON `members` (`semester_key`,`active`);--> statement-breakpoint
CREATE INDEX `idx_members_authenticated_user_id` ON `members` (`authenticated_user_id`);--> statement-breakpoint
CREATE TABLE `resources` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`original_filename` text NOT NULL,
	`object_key` text NOT NULL,
	`content_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`uploaded_by_user_id` text NOT NULL,
	`uploaded_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_resources_object_key` ON `resources` (`object_key`);--> statement-breakpoint
CREATE INDEX `idx_resources_category_uploaded_at` ON `resources` (`category`,`uploaded_at`);--> statement-breakpoint
PRAGMA optimize;
