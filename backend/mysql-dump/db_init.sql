USE mrtecno;

CREATE TABLE utente (
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY(username));

INSERT INTO utente VALUE("admin", "admin");