USE `skyradio`;

-- Migration table
CREATE TABLE `migrations` (
    `id` int AUTO_INCREMENT,
    `migration` varchar(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (migration)
);

-- Group table
CREATE TABLE `groups` (
    `id` int AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- User table
CREATE TABLE `users` (
    `id` int AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` enum('admin', 'user') NOT NULL DEFAULT 'user',
    `group_id` int NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (group_id) REFERENCES `groups`(id),
    UNIQUE KEY (email),
    INDEX (email)
);

-- Refresh token table
CREATE TABLE `refresh_tokens` (
    `id` int AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `token` varchar(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY (token, user_id),
    INDEX (token, user_id)
);
