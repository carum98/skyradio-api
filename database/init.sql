USE `skyradio`;

CREATE TABLE `users` (
    `id` int AUTO_INCREMENT,
    `name` text NOT NULL,
    `user_name` text NOT NULL,
    `password` text NOT NULL,
    PRIMARY KEY (id)
);