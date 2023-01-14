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
            shipping_cost: reqData.paypalDetails.purchase_units[0].amount.breakdown.shipping.value,
            shipping_code: "",
            notes: "",
            userId: userCode.id,
        });

        reqData.paypalDetails.purchase_units[0].items.forEach(async item => {

            const product = await Database.product.findOne({
                attributes: ['id', 'price'],
                where: { product_name: item.name 
                }
            })

            const newOrderProduct = await Database.order_product.create({
                qty: parseInt(item.quantity),
                priceEach: product.price,
                productId: product.id,
                orderId: newOrder.id,
            });

            await Database.product.decrement('qtyInStock', { 
                by: newOrderProduct.qty,
                where: {
                    id: product.id                    
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
            attributes: [[Database.sequelize.literal('SUM((qty * priceEach) + order.shipping_cost)'), 'order_total']],
            include: [
                {
                    attributes: ['id', 'order_date', 'order_status', 'shipping_cost'],
                    model: Database.order,
                    where: {
                        userId: userCode.id
                    },
                    required: true,
                },
                {
                    attributes: [],
                    model: Database.product,
                    required: true,
                },
            ],
            group: ['order.id'],
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

    async getOrderDetails(orderFE, req){
      
        const username = req.user.UserInfo.username;

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: username 
            }
        });

        if (userCode === undefined) return [404, "Utente non trovato"] 

        const order = await Database.order_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal('SUM((qty * priceEach) + order.shipping_cost)'), 'order_total'], 'qty', 'priceEach'],
            include: [
                {
                    model: Database.order,
                    where: {
                        userId: userCode.id,
                        id: orderFE,
                    },
                    required: true,
                },
                {
                    model: Database.product,
                    required: true,
                },
            ],
            group: ['order.id', 'product.id', 'qty', 'priceEach'],
        });

        if (!order) return [500, "Errore, impossibile recuperare gli ordini!"];

        const order_total_groupby = groupBy(order, 'order.id', 'order_total');

        order_total_groupby.forEach((item_gb) => {
            order.forEach((item_o) => {
                if(item_o['order.id'] === item_gb['order.id']) item_o['order_total'] = item_gb['order_total']
            })
        })

        return[order];

    }

}

module.exports = Order_controller;