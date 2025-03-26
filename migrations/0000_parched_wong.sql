CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`grade` int NOT NULL,
	`section` char NOT NULL,
	`male_number` int NOT NULL,
	`female_number` int NOT NULL,
	`detail` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`teacher_id` int NOT NULL,
	`school_id` int NOT NULL,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_unique` UNIQUE(`grade`,`section`,`school_id`)
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(16) NOT NULL,
	CONSTRAINT `groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `groups_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `group_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`group_id` int NOT NULL,
	`permission_id` int NOT NULL,
	CONSTRAINT `group_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(16) NOT NULL,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`address` varchar(64) NOT NULL,
	`codice_istituto` varchar(8) NOT NULL,
	`codice_scuola` varchar(8) NOT NULL,
	`details` varchar(256),
	CONSTRAINT `schools_id` PRIMARY KEY(`id`),
	CONSTRAINT `schools_codice_scuola_unique` UNIQUE(`codice_scuola`)
);
--> statement-breakpoint
CREATE TABLE `sessionKeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(8) NOT NULL,
	`sex` char NOT NULL,
	`session_id` int NOT NULL,
	CONSTRAINT `sessionKeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessionKeys_key_sessionId_unique` UNIQUE(`key`,`session_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state` varchar(16) NOT NULL DEFAULT 'waiting',
	`phase` varchar(16) NOT NULL,
	`code` varchar(16) NOT NULL,
	`details` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`started_at` timestamp,
	`user_id` int NOT NULL,
	`class_id` int NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(16) NOT NULL,
	`surname` varchar(32) NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`activeted` boolean NOT NULL DEFAULT false,
	`group_id` int NOT NULL DEFAULT 1,
	`school_id` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_teacher_id_users_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group_permissions` ADD CONSTRAINT `group_permissions_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group_permissions` ADD CONSTRAINT `group_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessionKeys` ADD CONSTRAINT `sessionKeys_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;