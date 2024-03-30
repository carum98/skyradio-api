CREATE TABLE `apps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(100),
	`license_id` int,
	`client_id` int,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `apps_id` PRIMARY KEY(`id`),
	CONSTRAINT `apps_license_id_unique` UNIQUE(`license_id`)
);
--> statement-breakpoint
CREATE TABLE `clients_console` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`license_id` int,
	`client_id` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `clients_console_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_console_license_id_unique` UNIQUE(`license_id`),
	CONSTRAINT `clients_console_client_id_unique` UNIQUE(`client_id`)
);
--> statement-breakpoint
CREATE TABLE `licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`key` varchar(50) NOT NULL,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `licenses_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `logs` MODIFY COLUMN `action` enum('create-client','create-radio','create-sim','create-app','add-radio-to-client','add-app-to-client','add-sim-to-radio','remove-radio-from-client','remove-sim-from-radio','swap-radio-from-client','swap-sim-from-radio','enable-console','disable-console') NOT NULL;--> statement-breakpoint
ALTER TABLE `logs` ADD `app_id` int;--> statement-breakpoint
CREATE INDEX `console_code` ON `apps` (`code`);--> statement-breakpoint
CREATE INDEX `license_id` ON `apps` (`license_id`);--> statement-breakpoint
CREATE INDEX `group_id` ON `apps` (`group_id`);--> statement-breakpoint
CREATE INDEX `console_code` ON `clients_console` (`code`);--> statement-breakpoint
CREATE INDEX `license_id` ON `clients_console` (`license_id`);--> statement-breakpoint
CREATE INDEX `licenses_code` ON `licenses` (`code`);--> statement-breakpoint
CREATE INDEX `group_id` ON `licenses` (`group_id`);--> statement-breakpoint
ALTER TABLE `logs` ADD CONSTRAINT `logs_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `apps` ADD CONSTRAINT `apps_license_id_licenses_id_fk` FOREIGN KEY (`license_id`) REFERENCES `licenses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `apps` ADD CONSTRAINT `apps_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `apps` ADD CONSTRAINT `apps_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients_console` ADD CONSTRAINT `clients_console_license_id_licenses_id_fk` FOREIGN KEY (`license_id`) REFERENCES `licenses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients_console` ADD CONSTRAINT `clients_console_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `licenses` ADD CONSTRAINT `licenses_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;