CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state` enum('waiting','started','finished') NOT NULL DEFAULT 'waiting',
	`phase` enum('training_1.1','training_1.2','test1','training_2.1','training_2.2','test2') NOT NULL,
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
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;