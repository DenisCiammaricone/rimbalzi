ALTER TABLE `games` MODIFY COLUMN `moves` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `games` MODIFY COLUMN `moves_count` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `games` MODIFY COLUMN `wrong_levels` int DEFAULT 10;