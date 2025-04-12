ALTER TABLE `logs_load_game` MODIFY COLUMN `action` varchar(10) NOT NULL DEFAULT 'load';--> statement-breakpoint
ALTER TABLE `schools` ADD `control` boolean DEFAULT false NOT NULL;