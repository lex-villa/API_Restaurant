--  Create database
CREATE DATABASE IF NOT EXISTS `delilah_resto`;
USE `delilah_resto`;
-- Users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `user_id` int unsigned NOT NULL AUTO_INCREMENT,
    `username` varchar(45) NOT NULL,
    `password` varchar(45) NOT NULL,
    `firstname` varchar(45) NOT NULL,
    `lastname` varchar(45) NOT NULL,
    `address` varchar(45) NOT NULL,
    `email` varchar(45) NOT NULL,
    `phone_number` varchar(45) NOT NULL,
    `is_admin` tinyint unsigned NOT NULL,
    PRIMARY KEY (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
-- Insert Users
INSERT INTO users
VALUES (
        1,
        'batman69',
        '123',
        'Bruce',
        'Wayne',
        'Dir 1',
        'bat@gmail.com',
        '54218463',
        0
    ),
    (
        2,
        'Gio08',
        'qwerty',
        'Giovanni',
        'Villa',
        'Dir 2',
        'gio@gmail.com',
        '54849685',
        1
    ),
    (
        3,
        'Ana07',
        'agsdas',
        'Ana',
        'Zende',
        'Dir 3',
        'ana@gmail.com',
        '54820130',
        1
    );
-- Orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
    `order_id` int unsigned NOT NULL AUTO_INCREMENT,
    `order_status` enum(
        'new',
        'confirmed',
        'preparing',
        'delivering',
        'delivered'
    ) NOT NULL DEFAULT 'new',
    `order_time` time NOT NULL,
    `order_description` varchar(45) NOT NULL,
    `order_amount` int unsigned NOT NULL,
    `payment_method` enum('cash', 'credit') NOT NULL,
    `user_id` int unsigned NOT NULL,
    PRIMARY KEY (`order_id`),
    KEY `user_id_idx` (`user_id`),
    CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
-- Products
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
    `product_id` int unsigned NOT NULL AUTO_INCREMENT,
    `product_name` varchar(45) NOT NULL,
    `product_price` int unsigned NOT NULL,
    `product_photo` varchar(500) NOT NULL,
    PRIMARY KEY (`product_id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
-- Insert Products
INSERT INTO `products`
VALUES (
        1,
        'FullStack Burger',
        150,
        '[https://url.jpg]'
    ),
    (
        2,
        'Semicolon Salad',
        70,
        '[https://url.jpg]'
    ),
    (
        3,
        'Kubernetes Fried Chicken',
        90,
        '[https://url.jpg]'
    ),
    (
        4,
        'Duck-Er',
        200,
        '[https://url.jpg]'
    ),
    (
        5,
        'Apple Pie',
        80,
        '[https://url.jpg]'
    ),
    (
        6,
        'AWS Fries',
        50,
        '[https://url.jpg]'
    ),
    (
        7,
        'Linux Mint Ice Cream',
        10,
        '[https://url.jpg]'
    ),
    (
        8,
        'Spaghetti Vue',
        290,
        '[https://url.jpg]'
    ),
    (
        9,
        'Javascript Special',
        500,
        '[https://url.jpg]'
    ),
    (
        10,
        'React wings',
        320,
        '[https://url.jpg]'
    );
-- Order_Products
DROP TABLE IF EXISTS `orders_products`;
CREATE TABLE `orders_products` (
    `relationship_id` int unsigned NOT NULL AUTO_INCREMENT,
    `order_id` int unsigned NOT NULL,
    `product_id` int unsigned NOT NULL,
    `product_quantity` int unsigned NOT NULL,
    PRIMARY KEY (`relationship_id`),
    KEY `order_id_idx` (`order_id`),
    KEY `product_id_idx` (`product_id`),
    CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
    CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = latin1;