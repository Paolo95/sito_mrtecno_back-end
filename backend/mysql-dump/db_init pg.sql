INSERT INTO "user" ("id", "lastname", "name", "email", "username", "password", "role", "refresh_token")
VALUES
        (default, 'Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'Paolo95', '$2b$10$FoBH/lFS/vob01aLOZVcJ.swWJh0yn0lwQ7FtmQhGTSgvtDwNCn72', 'admin', ''),
        (default, 'Tarquini', 'Adessio', 'tofodip848@lubde.com', 'Adessio95', '$2b$10$ffnFpG4sT65I3JkB3zC8QOT38iCHJ/EmAhQ/n0in.XtaazmJ8rsVC', 'customer', '');

INSERT INTO "product" ("id", "cover", "product_name", "photo_1", "photo_2", "photo_3", "category", "brandName", "price", "prod_description", "status","color","CPU", "RAM", "HDD", "graphics_card", "stars", "discount", "qtyInStock")
VALUES
        (default, '/images/products/1/iPhone13PRO.png', 'iPhone 13 PRO', '/images/products/1/71O4NPQno2L._AC_SX679_.jpg', '/images/products/1/-api-rest-00ed29448a7522f610cac04d7b9ea7e0-assets-afb52769c13c2e493a5c27cb149a6289-preview-sgmConversionBaseFormat-sgmProductFormat.jpg', '/images/products/1/-api-rest-00ed29448a7522f610cac04d7b9ea7e0-assets-afb52769c13c2e493a5c27cb149a6289-preview-sgmConversionBaseFormat-sgmProductFormat1.jpg', 'Smartphone', 'iPhone', 850.99, 'Descrizione iPhone','Nuovo', 'Nero','','','','',4, 20,100),
        (default, '/images/products/2/SamsungS22.png', 'Samsung Galaxy S22', '/images/products/2/81nwMXMJ8pL._AC_SX679_.jpg', '/images/products/2/81aEiwC+hCL._AC_SX679_.jpg', '/images/products/2/61ldvY7n0pL._AC_SX679_.jpg', 'Smartphone', 'Samsung', 450.00, 'Descrizione Samsung', 'Ricondizionato','Nero','','','','',5, 15,80),
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
        (NULL, '2023-02-01', '3383232123', '{""0"":{""name"":""zf"",""description"":""dzfv""}}', 'In lavorazione', 0, 'PayPal', 'Corriere', '', '', 'GLS',  9.99, 60.00, '', 1),
        (NULL, '2023-01-21', '3383535353', '{""0"":{""name"":""zf"",""description"":""dzfv""}}', 'Valutazione effettuata', 0, 'PayPal', 'Corriere', '', '', 'GLS', 9.99, 200.00, '', 2),
        (NULL, '2023-02-12', '3397373712', '{""0"":{""name"":""zf"",""description"":""dzfv""}}', 'In lavorazione', 0, 'PayPal', 'Corriere', '', '', 'GLS', 19.99, 40.00, '', 1),
        (NULL, '2023-01-12', '3391212311', '{""0"":{""name"":""zf"",""description"":""dzfv""}}', 'Oggetti ricevuti', 0, 'Bonifico', 'Corriere', '', '', 'GLS', 9.99, 300.00, '', 2);

INSERT INTO "barter_product" ("id", "qty", "priceEach", "productId", "barterId")
VALUES
        (NULL, 1, 850.99 , 1, 1),
        (NULL, 2, 450.00 , 2, 2);  

INSERT INTO "review" ("id", "review_date", "review_text", "review_reply", "stars", "userId", "productId")
VALUES
        (default, '2023-01-16', 'Testo recensione', 'Testo risposta', 4, 2, 4),
        (default, '2023-01-18', 'Testo recensione 2', '', 3, 1, 2);

INSERT INTO "faq" ("id", "question", "answer")
VALUES
        (default, 'Come funziona la permuta?', 'La permuta è molto semplice...'),
        (default, 'Posso pagare con PayPal?', 'Certo, accettiamo pagamenti con PayPal');

