CREATE TABLE `clients_modality` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(7) NOT NULL,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `clients_modality_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(7) NOT NULL,
	`group_id` int NOT NULL,
	`modality_id` int NOT NULL,
	`seller_id` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `clients_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `groups_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`group_id` int NOT NULL,
	`radio_id` int,
	`client_id` int,
	`sim_id` int,
	`action` enum('create-client','create-radio','create-sim','add-radio-to-client','add-sim-to-radio','remove-radio-from-client','remove-sim-from-radio','swap-radio-from-client','swap-sim-from-radio') NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `logs_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `radios_model` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(12) NOT NULL,
	`color` varchar(7) NOT NULL,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `radios_model_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `radios_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(12) NOT NULL,
	`color` varchar(7) NOT NULL,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `radios_status_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `radios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(100),
	`imei` varchar(50) NOT NULL,
	`serial` varchar(100),
	`model_id` int NOT NULL,
	`status_id` int,
	`sim_id` int,
	`client_id` int,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `radios_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `refresh_tokens_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `token` UNIQUE(`token`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `sellers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(255) NOT NULL,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `sellers_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sims_provider` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(7) NOT NULL,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `sims_provider_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`number` varchar(12) NOT NULL,
	`serial` varchar(24),
	`provider_id` int NOT NULL,
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `sims_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`group_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `users_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `group_id` ON `clients_modality` (`group_id`);--> statement-breakpoint
CREATE INDEX `group_id` ON `clients` (`group_id`);--> statement-breakpoint
CREATE INDEX `modality_id` ON `clients` (`modality_id`);--> statement-breakpoint
CREATE INDEX `seller_id` ON `clients` (`seller_id`);--> statement-breakpoint
CREATE INDEX `user_id` ON `logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `group_id` ON `logs` (`group_id`);--> statement-breakpoint
CREATE INDEX `radio_id` ON `logs` (`radio_id`);--> statement-breakpoint
CREATE INDEX `client_id` ON `logs` (`client_id`);--> statement-breakpoint
CREATE INDEX `sim_id` ON `logs` (`sim_id`);--> statement-breakpoint
CREATE INDEX `radios_model_code` ON `radios_model` (`code`);--> statement-breakpoint
CREATE INDEX `group_id` ON `radios_model` (`group_id`);--> statement-breakpoint
CREATE INDEX `radios_status_code` ON `radios_status` (`code`);--> statement-breakpoint
CREATE INDEX `group_id` ON `radios_status` (`group_id`);--> statement-breakpoint
CREATE INDEX `radios_code` ON `radios` (`code`);--> statement-breakpoint
CREATE INDEX `radios_model_id` ON `radios` (`model_id`);--> statement-breakpoint
CREATE INDEX `radios_status_id` ON `radios` (`status_id`);--> statement-breakpoint
CREATE INDEX `radios_sim_id` ON `radios` (`sim_id`);--> statement-breakpoint
CREATE INDEX `radios_client_id` ON `radios` (`client_id`);--> statement-breakpoint
CREATE INDEX `group_id` ON `radios` (`group_id`);--> statement-breakpoint
CREATE INDEX `user_id` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `token_2` ON `refresh_tokens` (`token`,`user_id`);--> statement-breakpoint
CREATE INDEX `sellers_code` ON `sellers` (`code`);--> statement-breakpoint
CREATE INDEX `group_id` ON `sellers` (`group_id`);--> statement-breakpoint
CREATE INDEX `sims_provider_code` ON `sims_provider` (`code`);--> statement-breakpoint
CREATE INDEX `group_id` ON `sims_provider` (`group_id`);--> statement-breakpoint
CREATE INDEX `sims_code` ON `sims` (`code`);--> statement-breakpoint
CREATE INDEX `provider_id` ON `sims` (`provider_id`);--> statement-breakpoint
CREATE INDEX `group_id` ON `sims` (`group_id`);--> statement-breakpoint
CREATE INDEX `group_id` ON `users` (`group_id`);--> statement-breakpoint
CREATE INDEX `email_2` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `clients_modality` ADD CONSTRAINT `clients_modality_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_modality_id_clients_modality_id_fk` FOREIGN KEY (`modality_id`) REFERENCES `clients_modality`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_seller_id_sellers_id_fk` FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs` ADD CONSTRAINT `logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs` ADD CONSTRAINT `logs_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs` ADD CONSTRAINT `logs_radio_id_radios_id_fk` FOREIGN KEY (`radio_id`) REFERENCES `radios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs` ADD CONSTRAINT `logs_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs` ADD CONSTRAINT `logs_sim_id_sims_id_fk` FOREIGN KEY (`sim_id`) REFERENCES `sims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `radios_model` ADD CONSTRAINT `radios_model_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `radios_status` ADD CONSTRAINT `radios_status_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `radios` ADD CONSTRAINT `radios_model_id_radios_model_id_fk` FOREIGN KEY (`model_id`) REFERENCES `radios_model`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `radios` ADD CONSTRAINT `radios_status_id_radios_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `radios_status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `radios` ADD CONSTRAINT `radios_sim_id_sims_id_fk` FOREIGN KEY (`sim_id`) REFERENCES `sims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `radios` ADD CONSTRAINT `radios_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `radios` ADD CONSTRAINT `radios_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sellers` ADD CONSTRAINT `sellers_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sims_provider` ADD CONSTRAINT `sims_provider_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sims` ADD CONSTRAINT `sims_provider_id_sims_provider_id_fk` FOREIGN KEY (`provider_id`) REFERENCES `sims_provider`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sims` ADD CONSTRAINT `sims_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE no action ON UPDATE no action;