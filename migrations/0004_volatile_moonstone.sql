CREATE TABLE `logs_load_game` (
	`id` int AUTO_INCREMENT NOT NULL,
	`action` varchar(10) NOT NULL DEFAULT 'reload',
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`session_id` int NOT NULL,
	`pupil_id` int NOT NULL,
	CONSTRAINT `logs_load_game_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `logs_load_game` ADD CONSTRAINT `logs_load_game_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs_load_game` ADD CONSTRAINT `logs_load_game_pupil_id_sessionKeys_id_fk` FOREIGN KEY (`pupil_id`) REFERENCES `sessionKeys`(`id`) ON DELETE no action ON UPDATE no action;