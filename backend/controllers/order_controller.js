const Database = require('../model/database');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const { or, Sequelize } = require('sequelize');
const { sequelize } = require('../model/database');
const groupBy = require('group-by-with-sum');

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

    async getUserOrders(req){

        const username = req.user.UserInfo.username;

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: username 
            }
        });

        if (userCode === undefined) return [404, "Utente non trovato"] 

        const order = await Database.order_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal('SUM((qty * product.price) + 20)'), 'order_total']],
            include: [
                {
                    model: Database.order,
                    where: {
                        userId: userCode.id
                    },
                    required: true,
                },
                {
                    model: Database.product,
                    required: true,
                },
            ],
            group: ['order.id', 'product.id'],
        });

        if (!order) return [500, "Errore, impossibile recuperare gli ordini!"]; 

        const order_total_groupby = groupBy(order, 'order.id', 'order_total');

        order_total_groupby.forEach((item_gb) => {
            order.forEach((item_o) => {
                if(item_o['order.id'] === item_gb['order.id']) item_o['order_total'] = item_gb['order_total']
            })
        })

        return[order.filter((v,i,a)=>a.findIndex(v2=>(v2['order.id']===v['order.id']))===i)];

    }

}

module.exports = Order_controller;