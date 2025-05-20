CREATE TABLE `default_sequences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`grade` int NOT NULL,
	`phase` varchar(16) NOT NULL,
	`sequence_id` int NOT NULL DEFAULT 1,
	CONSTRAINT `default_sequences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `default_sequences` ADD CONSTRAINT `default_sequences_sequence_id_session_sequences_id_fk` FOREIGN KEY (`sequence_id`) REFERENCES `session_sequences`(`id`) ON DELETE no action ON UPDATE no action;