ALTER TABLE `classes` ADD `grade` int NOT NULL;--> statement-breakpoint
ALTER TABLE `classes` ADD `section` char NOT NULL;--> statement-breakpoint
ALTER TABLE `classes` DROP COLUMN `code`;