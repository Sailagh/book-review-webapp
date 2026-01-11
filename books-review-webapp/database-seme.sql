CREATE DATABASE IF NOT EXISTS `portal`;
USE `portal`;

CREATE TABLE IF NOT EXISTS `types` (
	`type_id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (`type_id`)
);
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE IF NOT EXISTS `books` (
	`id_b` INT NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(250) NOT NULL,
    `author_name` VARCHAR(255) ,
    `description` VARCHAR(512) ,
    `ISBN` VARCHAR(13),
    `type_id` INT,
    
	FOREIGN KEY (type_id) REFERENCES types(type_id),
    PRIMARY KEY (id_b)
   
);
CREATE TABLE IF NOT EXISTS `reviews` (
	`id_a` INT NOT NULL AUTO_INCREMENT,
	`book_title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(800) NOT NULL,
    `rating` INT,
    `user_id` INT NOT NULL,
    `id_b` INT NOT NULL,

    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
	FOREIGN KEY (id_b) REFERENCES books(id_b),
    PRIMARY KEY (id_a),
    INDEX `idx_books_id_b` (`id_b`)
    
);


