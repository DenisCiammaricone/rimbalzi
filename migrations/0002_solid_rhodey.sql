CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(4) NOT NULL,
	`male_number` int NOT NULL,
	`female_number` int NOT NULL,
	`detail` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`teacher_id` int NOT NULL,
	`school_id` int NOT NULL,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `schools` DROP INDEX `schools_codice_istituto_unique`;--> statement-breakpoint
ALTER TABLE `schools` MODIFY COLUMN `details` varchar(256);--> statement-breakpoint
ALTER TABLE `schools` ADD CONSTRAINT `schools_codice_scuola_unique` UNIQUE(`codice_scuola`);--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_teacher_id_users_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;