const Database = require('../model/database');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Sequelize } = require('sequelize');
const MimeNode = require('nodemailer/lib/mime-node');
const { use } = require('../routes/users');

dotenv.config();

class Order_controller{

    constructor(){};

    async createOrder(reqData){

        const decoded = jwt.decode(reqData.userInfo, process.env.ACCESS_TOKEN_SECRET);

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: decoded.UserInfo.username 
            }
        });

        if (userCode === undefined) return [404, "Utente non trovato!"];

        const order_address = 
        reqData.paypalDetails.purchase_units[0].shipping.address.address_line_1 + " - " +
            reqData.paypalDetails.purchase_units[0].shipping.address.postal_code + " - " +
                reqData.paypalDetails.purchase_units[0].shipping.address.admin_area_1;

        const order_date = reqData.paypalDetails.create_time.substring(0, 10);

        const newOrder = await Database.order.create({
            order_date: order_date,
            order_status: "Ordine in lavorazione",
            shipping_address: order_address,
            shipping_code: "",
            notes: "",
            userId: userCode.id,
        });

        reqData.paypalDetails.purchase_units[0].items.forEach(async item => {

            const productId = await Database.product.findOne({
                attributes: ['id'],
                where: { product_name: item.name 
                }
            })

            const newOrderProduct = await Database.order_product.create({
                qty: parseInt(item.quantity),
                productId: productId.id,
                orderId: newOrder.id,
            });

            await Database.product.decrement('qtyInStock', { 
                by: newOrderProduct.qty,
                where: {
                    id: productId.id                    
                }
            })
        });        

        return [200, "Ordine salvato correttamente!"];
    }

}

module.exports = Order_controller;