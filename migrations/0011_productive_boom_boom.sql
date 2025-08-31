ALTER TABLE `users` DROP FOREIGN KEY `users_school_id_schools_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `school_id` varchar(16);