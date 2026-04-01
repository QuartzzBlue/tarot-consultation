CREATE TABLE `reading_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`readingId` int NOT NULL,
	`cardId` int NOT NULL,
	`position` int NOT NULL,
	`positionName` varchar(100),
	`isReversed` boolean NOT NULL DEFAULT false,
	CONSTRAINT `reading_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`question` text NOT NULL,
	`spreadType` varchar(50) NOT NULL DEFAULT 'three-card',
	`interpretation` text,
	`isPublic` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tarot_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cardNumber` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameKo` varchar(100) NOT NULL,
	`arcana` enum('major','minor') NOT NULL,
	`suit` varchar(50),
	`uprightMeaning` text NOT NULL,
	`reversedMeaning` text NOT NULL,
	`description` text NOT NULL,
	`keywords` json NOT NULL,
	`imageUrl` text,
	`imagePrompt` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tarot_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `reading_cards` ADD CONSTRAINT `reading_cards_readingId_readings_id_fk` FOREIGN KEY (`readingId`) REFERENCES `readings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_cards` ADD CONSTRAINT `reading_cards_cardId_tarot_cards_id_fk` FOREIGN KEY (`cardId`) REFERENCES `tarot_cards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `readings` ADD CONSTRAINT `readings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;