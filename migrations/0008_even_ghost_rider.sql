ALTER TABLE `games` RENAME COLUMN `session_key_id` TO `session_key`;--> statement-breakpoint
ALTER TABLE `games` DROP FOREIGN KEY `games_session_key_id_sessionKeys_id_fk`;
--> statement-breakpoint
ALTER TABLE `games` MODIFY COLUMN `session_key` varchar(8) NOT NULL;--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_session_key_sessionKeys_key_fk` FOREIGN KEY (`session_key`) REFERENCES `sessionKeys`(`key`) ON DELETE no action ON UPDATE no action;