CREATE TABLE `logs_release_shot` (
	`id` int AUTO_INCREMENT NOT NULL,
	`action` varchar(10) NOT NULL DEFAULT 'rel_sht',
	`level` int NOT NULL,
	`from` varchar(5) NOT NULL,
	`to` varchar(5) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`session_id` int NOT NULL,
	`pupil_id` int NOT NULL,
	CONSTRAINT `logs_release_shot_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `logs_release_shot` ADD CONSTRAINT `logs_release_shot_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs_release_shot` ADD CONSTRAINT `logs_release_shot_pupil_id_sessionKeys_id_fk` FOREIGN KEY (`pupil_id`) REFERENCES `sessionKeys`(`id`) ON DELETE no action ON UPDATE no action;