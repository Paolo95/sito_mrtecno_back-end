INSERT INTO `user` (`id`, `lastname`, `name`, `email`, `username`, `password`, `role`, `refresh_token`)
VALUES
        (NULL, "Compagnoni", "Paolo", "compagnonipaolo95@gmail.com", "Paolo95", "$2b$10$FoBH/lFS/vob01aLOZVcJ.swWJh0yn0lwQ7FtmQhGTSgvtDwNCn72", "admin", ""),
        (NULL, "Tarquini", "Adessio", "tofodip848@lubde.com", "Adessio95", "$2b$10$ffnFpG4sT65I3JkB3zC8QOT38iCHJ/EmAhQ/n0in.XtaazmJ8rsVC", "customer", "");

INSERT INTO `product` (`id`, `cover`, `product_name`, `photo_1`, `photo_2`, `photo_3`, `category`, `brandName`, `price`, `prod_description`, `CPU`, `RAM`, `HDD`, `graphics_card`, `stars`, `discount`, `qtyInStock`)
VALUES
        (NULL, "./images/arrivals/arrivals1.png", "iPhone 13 PRO", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "Smartphone", "iPhone", 850.99, "Descrizione iPhone","","","","",4, 20,100),
        (NULL, "./images/arrivals/arrivals2.png", "Samsung Galaxy S22", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals2.png", "./images/arrivals/arrivals2.png", "Smartphone", "Samsung", 450.00, "Descrizione Samsung","","","","",5, 15,80),
        (NULL, "./images/arrivals/arrivals2.png", "Vivo android one", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "Smartphone", "Vivo", 120.90, "Descrizione Vivo","","","","",3, 25,100),
        (NULL, "./images/arrivals/arrivals2.png", "Mapple Earphones", "./images/arrivals/arrivals2.png", "./images/arrivals/arrivals2.png", "./images/arrivals/arrivals2.png", "Smartphone", "Samsung", 180.00, "Descrizione Samsung","","","","",5, 15,80),
        (NULL, "./images/arrivals/arrivals1.png", "Sony Light", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "Smartphone", "Oppo", 20.00, "Descrizione Oppo","","","","",2, 20,100),
        (NULL, "./images/arrivals/arrivals2.png", "Alienware", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals2.png", "./images/arrivals/arrivals2.png", "PC", "AlienWare", 1450.00, "Descrizione Alienware","Intel core i5","8gb","1TB","NVIDIA Geforce",5, 15,80),
        (NULL, "./images/arrivals/arrivals2.png", "HP Office Desktop PC", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "./images/arrivals/arrivals1.png", "PC", "HP", 820.00, "Descrizione PC HP","","","","",3, 25,100),
        (NULL, "./images/arrivals/arrivals2.png", "Tablet Android", "./images/arrivals/arrivals2.png", "./images/arrivals/arrivals2.png", "./images/arrivals/arrivals2.png", "Tablet", "Samsung", 180.00, "Descrizione Tablet","","","","",5, 15,80);

INSERT INTO `order` (`id`, `order_date`, `order_status`, `shipping_address`, `shipping_code`, `notes`, `userId`)
VALUES
        (NULL, "2022-12-12", "Ordine concluso", "Viale Piane 13 - 64013 - Corropoli", "12335131", "Note ordine...", 1),
        (NULL, "2022-12-10", "Ordine in lavorazione", "Viale Piane 16 - 64013 - Corropoli", "w5634565", "Note ordine...", 2);

INSERT INTO `order_product` (`id`, `qty`, `productId`, `orderId`)
VALUES
        (NULL, 1, 1, 2),
        (NULL, 2, 2, 2);