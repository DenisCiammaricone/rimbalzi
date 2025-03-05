CREATE TABLE `session_sequences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expected_class_grade` int NOT NULL,
	`sequences` json,
	`details` varchar(256),
	CONSTRAINT `session_sequences_id` PRIMARY KEY(`id`)
);
