USE `skyradio`;

CREATE TABLE `users` (
    `id` int AUTO_INCREMENT,
    `name` text NOT NULL,
    `email` text NOT NULL,
    `password` text NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` timestamp NULL DEFAULT NULL,
    `remember_token` text,
    PRIMARY KEY (id)
);