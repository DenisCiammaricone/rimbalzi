CREATE TABLE `schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`address` varchar(64) NOT NULL,
	`codice_istituto` varchar(8) NOT NULL,
	`codice_scuola` varchar(8) NOT NULL,
	`details` varchar(256) NOT NULL,
	CONSTRAINT `schools_id` PRIMARY KEY(`id`),
	CONSTRAINT `schools_codice_istituto_unique` UNIQUE(`codice_istituto`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP FOREIGN KEY `users_school_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;