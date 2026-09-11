CREATE TABLE `activity` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`title` text NOT NULL,
	`at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`payload` text NOT NULL,
	`updated` text NOT NULL
);
