ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','user','guest','seller') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `sellers` ADD `user_id` int;--> statement-breakpoint
ALTER TABLE `sellers` ADD CONSTRAINT `sellers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;