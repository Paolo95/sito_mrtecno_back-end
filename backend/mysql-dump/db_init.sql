USE mrtecno;

CREATE TABLE user (
    user_id INTEGER NOT NULL AUTO_INCREMENT,
    lastname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY(user_id));

INSERT INTO user VALUE(1, "Compagnoni", "Paolo", "compagnonipaolo95@gmail.com", "Paolo95", "Paolo1995!");