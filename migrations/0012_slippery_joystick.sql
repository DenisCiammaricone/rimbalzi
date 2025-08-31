ALTER TABLE `classes` DROP FOREIGN KEY `classes_school_id_schools_id_fk`;
--> statement-breakpoint
ALTER TABLE `classes` MODIFY COLUMN `school_id` varchar(16) NOT NULL;