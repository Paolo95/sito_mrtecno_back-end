INSERT INTO `user` (`id`, `lastname`, `name`, `email`, `username`, `password`, `role`, `refresh_token`)
VALUES
        (NULL, "Compagnoni", "Paolo", "compagnonipaolo95@gmail.com", "Paolo95", "$2b$10$FoBH/lFS/vob01aLOZVcJ.swWJh0yn0lwQ7FtmQhGTSgvtDwNCn72", "admin", ""),
        (NULL, "Tarquini", "Adessio", "tofodip848@lubde.com", "Adessio95", "$2b$10$ffnFpG4sT65I3JkB3zC8QOT38iCHJ/EmAhQ/n0in.XtaazmJ8rsVC", "customer", "");

INSERT INTO `product` (`id`, `cover`, `product_name`, `photo_1`, `photo_2`, `photo_3`, `category`, `brandName`, `price`, `prod_description`, `status`,`color`,`CPU`, `RAM`, `HDD`, `graphics_card`, `stars`, `discount`, `qtyInStock`)
VALUES
        (NULL, "https://lh3.googleusercontent.com/drive-viewer/AAOQEOQBm90rFGGjSj4YUa6BhJ1c1pGL_NXJY17r_FqSTXICyO1IvungQt7aFP022cH4u2I11qb7DrN1stfl0O5IjCfOvvoPOw=s2560", "iPhone 13 PRO | Graphite | 256GB", "https://lh3.googleusercontent.com/drive-viewer/AAOQEORZikszNnQs2eQnfh1h0GZmZIZAR6SsKwxvgLWz7bV5ETnN83CmpeopwMOiOeggQADjx2Zjx3aWOFdXkXieHnGrdzt-cw=s2560", "https://lh3.googleusercontent.com/drive-viewer/AAOQEORI8ZNJlQ2-MQVLcVsOrRnKwaGuyZU3MpXZHdIpbqf1N923TqJ9UX7E9dp7kYWdUU-ZxL0FKS53fpDzc5l_ILXy2ppP=s2560", "https://lh3.googleusercontent.com/drive-viewer/AAOQEOR46pQdZ2h2UEXLZa0Mdz9cS9X0-HHrVM36A9naaVJq8QU4yxucGm0-fmmcikEzFfTOZk2dIenai0aA75wXXjb5lBircQ=s2560", "Smartphone", "iPhone", 1999.99, "Descrizione iPhone","Nuovo", "Graphite","","","256GB","",4, 5,100),
        (NULL, "https://lh3.googleusercontent.com/drive-viewer/AAOQEORkwkj4imp5KRrrlGnwJMXB8YG6cKSpErWe1cvq9I0uIhjm0o-hu7RqLdrWseMUWAKaofBQK_BM-eemco59Ynn8z-lk=s2560", "Samsung Galaxy S22", "https://lh3.googleusercontent.com/drive-viewer/AAOQEOSlvfVFbcA7NkcUW63EEWlP_duJ-ZjHUm1MdR0nqU5gmNrKqhbY1jGF-svrvQmOpB9qQ_lyMpAVJFZTqyC_glHKnsE2EA=s2560", "https://lh3.googleusercontent.com/drive-viewer/AAOQEORoQpg-Rb2EHO2jBPcXkofLUi-xotBmVqOrjfnvXGZh5q9pdmh1afY-upquxzS3CBPIUuevTksGhfygpX6beWCKBcJYeQ=s2560", "https://lh3.googleusercontent.com/drive-viewer/AAOQEORVSlbW1DR2KWsgMGkGU1O5_HA7b93yno5NsFgBWMUuql2z573SvPs3PCE1uWYj41_HDfYRoerPWKvu8d1vy4RfqL2LWg=s2560", "Smartphone", "Samsung", 559.00, "Descrizione Samsung", "Nuovo","Nero","","","","",5, 3,80),
        (NULL, "/images/products/3/arrivals2.png", "Vivo android one", "/images/products/3/arrivals1.png", "/images/products/3/arrivals1.png", "/images/products/3/arrivals1.png", "Smartphone", "Vivo", 120.90, "Descrizione Vivo", "Ricondizionato", "Blu","","","","",3, 25,100),
        (NULL, "/images/products/4/arrivals2.png", "Mapple Earphones", "/images/products/4/arrivals2.png", "/images/products/4/arrivals2.png", "/images/products/4/arrivals2.png", "Smartphone", "Samsung", 180.00, "Descrizione Samsung","Ricondizionato" , "Nero","","","","",5, 15,80),
        (NULL, "/images/products/6/arrivals2.png", "Alienware", "/images/products/6/arrivals1.png", "/images/products/6/arrivals2.png", "/images/products/6/arrivals2.png", "PC", "AlienWare", 1450.00, "Descrizione Alienware","Nuovo", "", "Intel core i5","8gb","1TB","NVIDIA Geforce",5, 15,80),
        (NULL, "/images/products/7/arrivals2.png", "HP Office Desktop PC", "/images/products/7/arrivals1.png", "/images/products/7/arrivals1.png", "/images/products/7/arrivals1.png", "PC", "HP", 820.00, "Descrizione PC HP","Nuovo", "","","","","",3, 25,100),
        (NULL, "/images/products/8/arrivals2.png", "Tablet Android", "/images/products/8/arrivals2.png", "/images/products/8/arrivals2.png", "/images/products/8/arrivals2.png", "Tablet", "Samsung", 180.00, "Descrizione Tablet","Nuovo", "","","","","",5, 15,80);

INSERT INTO `order` (`id`, `order_date`, `order_status`, `shipping_type`, `shipping_address`, `shipping_carrier`, `shipping_cost`, `payment_method`, `paypal_fee`, `shipping_code`, `notes`, `userId`)
VALUES
        (NULL, "2022-12-12", "Concluso", "Corriere", "Viale Piane 13 - 64013 - Corropoli", "GLS", 9.99 , "PayPal", 10.23 , "12335131", "Note ordine...", 2),
        (NULL, "2022-12-10", "In lavorazione", "Corriere", "Viale Piane 16 - 64013 - Corropoli", "GLS", 9.99 , "PayPal", 3.88, "w5634565", "Note ordine...", 2);

INSERT INTO `order_product` (`id`, `qty`, `priceEach`, `productId`, `orderId`)
VALUES
        (NULL, 1, 850.99 , 1, 1),
        (NULL, 2, 450.00 , 2, 2);

INSERT INTO `barter` (`id`, `barter_date`, `barter_telephone`, `barter_items`, `status`, `paypal_fee`, `payment_method`, `shipping_type`, `shipping_code`, `shipping_address`, `shipping_carrier`, `shipping_cost`, `barter_evaluation`, `notes`, `userId`)
VALUES
        (NULL, "2023-02-01", "3383232123", "{""0"":{""name"":""zf"",""description"":""dzfv""}}", "In lavorazione", 0, "PayPal", "Corriere", "", "", "GLS",  9.99, 60.00, "", 1),
        (NULL, "2023-01-21", "3383535353", "{""0"":{""name"":""zf"",""description"":""dzfv""}}", "Valutazione effettuata", 0, "PayPal", "Corriere", "", "", "GLS", 9.99, 200.00, "", 2);

INSERT INTO `barter_product` (`id`, `qty`, `priceEach`, `productId`, `barterId`)
VALUES
        (NULL, 1, 850.99 , 1, 1),
        (NULL, 2, 450.00 , 2, 2);        

INSERT INTO `review` (`id`, `review_date`, `review_text`, `review_reply`, `stars`, `userId`, `productId`)
VALUES
        (NULL, "2023-01-16", "Testo recensione", "Testo risposta", 4, 2, 4),
        (NULL, "2023-01-18", "Testo recensione 2", "", 3, 1, 2);

INSERT INTO `faq` (`id`, `question`, `answer`)
VALUES
        (NULL, "Come funziona la permuta?", "La permuta è molto semplice..."),
        (NULL, "Posso pagare con PayPal?", "Certo, accettiamo pagamenti con PayPal");

