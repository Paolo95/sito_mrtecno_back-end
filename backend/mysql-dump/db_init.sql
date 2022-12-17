USE mrtecno;

CREATE TABLE user (
    user_id INTEGER NOT NULL AUTO_INCREMENT,
    lastname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' NOT NULL,
    refresh_token varchar(600) DEFAULT '' NOT NULL,
    PRIMARY KEY(user_id));

INSERT INTO user (user_id, lastname, name, email, username, password, role, refresh_token)
VALUES
        (1, "Compagnoni", "Paolo", "compagnonipaolo95@gmail.com", "Paolo95", "$2b$10$FoBH/lFS/vob01aLOZVcJ.swWJh0yn0lwQ7FtmQhGTSgvtDwNCn72", "admin", ""),
        (2, "Tarquini", "Adessio", "tofodip848@lubde.com", "Adessio95", "$2b$10$ffnFpG4sT65I3JkB3zC8QOT38iCHJ/EmAhQ/n0in.XtaazmJ8rsVC", "customer", "");

