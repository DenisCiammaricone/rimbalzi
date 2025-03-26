ALTER TABLE `games` RENAME COLUMN `session_key` TO `session_key_id`;--> statement-breakpoint
ALTER TABLE `games` DROP FOREIGN KEY `games_session_key_sessionKeys_id_fk`;
--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_session_key_id_sessionKeys_id_fk` FOREIGN KEY (`session_key_id`) REFERENCES `sessionKeys`(`id`) ON DELETE no action ON UPDATE no action;