ALTER TABLE `sessionKeys` DROP FOREIGN KEY `sessionKeys_session_id_sessions_id_fk`;
--> statement-breakpoint
ALTER TABLE `sessionKeys` ADD CONSTRAINT `sessionKeys_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE cascade ON UPDATE no action;