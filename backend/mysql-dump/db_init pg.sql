INSERT INTO "user" ("id", "lastname", "name", "email", "username", "password", "role", "refresh_token")
VALUES
        (default, 'Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'Paolo95', '$2b$10$FoBH/lFS/vob01aLOZVcJ.swWJh0yn0lwQ7FtmQhGTSgvtDwNCn72', 'admin', ''),
        (default, 'Tarquini', 'Adessio', 'tofodip848@lubde.com', 'Adessio95', '$2b$10$ffnFpG4sT65I3JkB3zC8QOT38iCHJ/EmAhQ/n0in.XtaazmJ8rsVC', 'customer', '');

INSERT INTO "product" ("id", "cover", "product_name", "photo_1", "photo_2", "photo_3", "category", "brandName", "price", "prod_description", "status","color","CPU", "RAM", "HDD", "graphics_card", "stars", "discount", "qtyInStock")
VALUES
        (default, 'https://drive.google.com/uc?export=view&id=1ickGVE8CeXZkNxMPBmMZ8-l59iMbiGT6', 'iPhone 13 PRO', 'https://drive.google.com/uc?export=view&id=1T6gdKDnGZzaTfTCKt0dQfS5DiQPGRUhB', 'https://drive.google.com/uc?export=view&id=1qhDPeiSr4g5Yu7hthYZ0CW46ZePk0YVf', 'https://drive.google.com/uc?export=view&id=1nVTBqtiYnC8kYLlHMQYvIIGBi_5YfqDg', 'Smartphone', 'iPhone', 850.99, 'Descrizione iPhone','Nuovo', 'Nero','','','','',4, 20,100),
        (default, 'https://drive.google.com/uc?export=view&id=17F56Lw5_h0gvorZLbMBx6xmuO3VW77TQ', 'Samsung Galaxy S22', 'https://drive.google.com/uc?export=view&id=1MAgmNoUrQQKefZzozCWHAztJarlc2XIq', 'https://drive.google.com/uc?export=view&id=1Kgu9EWzS4KR93UkKCkIBUvN0NzyNluMn', 'https://drive.google.com/uc?export=view&id=1SUmWkDAaYLPBp_MXhZzrGf5plJKTW_KI', 'Smartphone', 'Samsung', 450.00, 'Descrizione Samsung', 'Ricondizionato','Nero','','','','',5, 15,80),
        (default, '/images/products/3/arrivals2.png', 'Vivo android one', '/images/products/3/arrivals1.png', '/images/products/3/arrivals1.png', '/images/products/3/arrivals1.png', 'Smartphone', 'Vivo', 120.90, 'Descrizione Vivo', 'Nuovo', 'Blu','','','','',3, 25,100),
        (default, '/images/products/4/arrivals2.png', 'Mapple Earphones', '/images/products/4/arrivals2.png', '/images/products/4/arrivals2.png', '/images/products/4/arrivals2.png', 'Smartphone', 'Samsung', 180.00, 'Descrizione Samsung','Ricondizionato' , 'Nero','','','','',5, 15,80),
        (default, '/images/products/5/arrivals1.png', 'Sony Light', '/images/products/5/arrivals1.png', '/images/products/5/arrivals1.png', '/images/products/5/arrivals1.png', 'Smartphone', 'Oppo', 20.00, 'Descrizione Oppo', 'Nuovo', '', '','','','',2, 20,100),
        (default, '/images/products/6/arrivals2.png', 'Alienware', '/images/products/6/arrivals1.png', '/images/products/6/arrivals2.png', '/images/products/6/arrivals2.png', 'PC', 'AlienWare', 1450.00, 'Descrizione Alienware','Nuovo', '', 'Intel core i5','8gb','1TB','NVIDIA Geforce',5, 15,80),
        (default, '/images/products/7/arrivals2.png', 'HP Office Desktop PC', '/images/products/7/arrivals1.png', '/images/products/7/arrivals1.png', '/images/products/7/arrivals1.png', 'PC', 'HP', 820.00, 'Descrizione PC HP','Nuovo', '','','','','',3, 25,100),
        (default, '/images/products/8/arrivals2.png', 'Tablet Android', '/images/products/8/arrivals2.png', '/images/products/8/arrivals2.png', '/images/products/8/arrivals2.png', 'Tablet', 'Samsung', 180.00, 'Descrizione Tablet','Nuovo', '','','','','',5, 15,80);

INSERT INTO "order" ("id", "order_date", "order_status", "shipping_type","shipping_address", "shipping_carrier", "shipping_cost", "payment_method", "paypal_fee", "shipping_code", "notes", "userId")
VALUES
        (default, '2022-12-12', 'Concluso', 'Corriere', 'Viale Piane 13 - 64013 - Corropoli', 'GLS', 9.99 , 'PayPal', 10.23 , '12335131', 'Note ordine...', 2),
        (default, '2022-12-10', 'In lavorazione', 'Corriere', 'Viale Piane 16 - 64013 - Corropoli', 'GLS', 9.99 , 'PayPal', 3.88, 'w5634565', 'Note ordine...', 2);

INSERT INTO "order_product" ("id", "qty", "priceEach", "productId", "orderId")
VALUES
        (default, 1, 850.99 , 1, 1),
        (default, 2, 450.00 , 2, 2);

INSERT INTO "barter" ("id", "barter_date", "barter_telephone", "barter_items", "status", "paypal_fee", "payment_method", "shipping_type", "shipping_code", "shipping_address", "shipping_carrier", "shipping_cost", "barter_evaluation", "notes", "userId")
VALUES
        (default, '2023-02-01', '3383232123', '{"0":{"name":"zf","description":"dzfv"}}', 'In lavorazione', 0, 'PayPal', 'Corriere', '', '', 'GLS',  9.99, 60.00, '', 1),
        (default, '2023-01-21', '3383535353', '{"0":{"name":"zf","description":"dzfv"}}', 'Valutazione effettuata', 0, 'PayPal', 'Corriere', '', '', 'GLS', 9.99, 200.00, '', 2);

INSERT INTO "barter_product" ("id", "qty", "priceEach", "productId", "barterId")
VALUES
        (default, 1, 850.99 , 1, 1),
        (default, 2, 450.00 , 2, 2);  

INSERT INTO "review" ("id", "review_date", "review_text", "review_reply", "stars", "userId", "productId")
VALUES
        (default, '2023-01-16', 'Testo recensione', 'Testo risposta', 4, 2, 4),
        (default, '2023-01-18', 'Testo recensione 2', '', 3, 1, 2);

INSERT INTO "faq" ("id", "question", "answer")
VALUES
        (default, 'Come funziona la permuta?', 'La permuta è molto semplice...'),
        (default, 'Posso pagare con PayPal?', 'Certo, accettiamo pagamenti con PayPal');

