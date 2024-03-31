create database clainbow;
use clainbow;

CREATE TABLE user (
user_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100),
last_name VARCHAR(100),
passport VARCHAR(15),
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL,
phone_number VARCHAR(20),    
address VARCHAR(100),
city VARCHAR(50),
country VARCHAR(50),
user_img VARCHAR(200),
user_isverified BOOLEAN NOT NULL default 0, -- 0 no verificado | 1 verificado
user_type tinyint NOT NULL default 2, -- 1 admin | 2 user
user_registered DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
user_isdisabled BOOLEAN NOT NULL default 0,   
user_isdeleted BOOLEAN NOT NULL default 0,
public_closet BOOLEAN NOT NULL default 0
);

CREATE TABLE user_follows_user (
user_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
followed_user_id INT UNSIGNED NOT NULL,
CONSTRAINT fk_user_1 FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_user_2 FOREIGN KEY (followed_user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE category (
	category_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	category_name VARCHAR(45) NOT NULL UNIQUE 
);

CREATE TABLE article (
article_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
article_name VARCHAR(45) NOT NULL,  
price DECIMAL(7,2) NOT NULL, -- 99999,99
colour VARCHAR (50) NOT NULL,  
fabric VARCHAR (50),
description VARCHAR(255),
visit BIGINT UNSIGNED NOT NULL DEFAULT 0,
article_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
article_isdeleted BOOLEAN NOT NULL DEFAULT 0,
article_isdisabled BOOLEAN NOT NULL DEFAULT 0,
creator_user_id INT UNSIGNED NOT NULL,
category_id INT UNSIGNED NOT NULL,
CONSTRAINT fk_user_3 FOREIGN KEY (creator_user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_category_1 FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE user_likes_article (
user_id INT UNSIGNED NOT NULL,
article_id BIGINT UNSIGNED NOT NULL,
primary key(user_id, article_id),
CONSTRAINT fk_user_4 FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_article_1 FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE order_article (
order_article_id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
user_id INT UNSIGNED NOT NULL,
article_id  BIGINT UNSIGNED NOT NULL,
amount  INT UNSIGNED NOT NULL,
order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
CONSTRAINT fk_user_5 FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_article_2 FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE resource (
resource_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
resource_name VARCHAR(200),
resource_isdeleted BOOLEAN NOT NULL DEFAULT 0,
article_id BIGINT UNSIGNED NOT NULL,
CONSTRAINT fk_article_3 FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- ----------------------- SHOULD HAVE ----------------------------
CREATE TABLE collection (
collection_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
collection_name VARCHAR(200) NOT NULL,
creator_user_id INT UNSIGNED NOT NULL,
CONSTRAINT fk_user_6 FOREIGN KEY (creator_user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE user_likes_collection (
user_id INT UNSIGNED NOT NULL,
collection_id INT UNSIGNED NOT NULL,
CONSTRAINT fk_user_7 FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_collection_1 FOREIGN KEY (collection_id) REFERENCES collection(collection_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE article_collection (
collection_id INT UNSIGNED NOT NULL ,
article_id BIGINT UNSIGNED NOT NULL,
CONSTRAINT fk_collection_2 FOREIGN KEY (collection_id) REFERENCES collection(collection_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_article_4 FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO category (category_name)
VALUES
('Ropa de Hombre'),
('Calzado Deportivo'),
('Ropa de Mujer'),
('Accesorios'),
('Calzado Casual'),
('Ropa Infantil'),
('Calzado Formal'),
('Ropa Deportiva'),
('Bolsos y Carteras'),
('Ropa Interior');

