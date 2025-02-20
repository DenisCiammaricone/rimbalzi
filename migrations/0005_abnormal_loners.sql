CREATE TABLE `sessionKeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(8) NOT NULL,
	`sex` char NOT NULL,
	`session_id` int NOT NULL,
	CONSTRAINT `sessionKeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessionKeys_key_sessionId_unique` UNIQUE(`key`,`session_id`)
);
--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `state` varchar(16) NOT NULL DEFAULT 'waiting';--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `phase` varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `sessionKeys` ADD CONSTRAINT `sessionKeys_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE no action ON UPDATE no action;