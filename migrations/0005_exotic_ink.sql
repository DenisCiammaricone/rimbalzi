CREATE TABLE `games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moves` json,
	`moves_count` int,
	`wrong_levels` json,
	`session_key` int NOT NULL,
	`session_id` int NOT NULL,
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_session_key_sessionKeys_id_fk` FOREIGN KEY (`session_key`) REFERENCES `sessionKeys`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE no action ON UPDATE no action;