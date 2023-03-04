const Database = require('../model/database');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const { or, Sequelize, Op } = require('sequelize');
const { sequelize } = require('../model/database');
const groupBy = require('group-by-with-sum');
const moment = require('moment');
moment().format();

dotenv.config();

class Order_controller{

    constructor(){};

    async createOrder(reqData){

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: reqData.user.UserInfo.username 
            }
        });

        if ( !userCode ) return [404, "Utente non trovato!"];

        const order_address = 
        reqData.body.paypalDetails.purchase_units[0].shipping.address.address_line_1 + " - " +
            reqData.body.paypalDetails.purchase_units[0].shipping.address.postal_code + " - " +
                reqData.body.paypalDetails.purchase_units[0].shipping.address.admin_area_1;



        const order_date = reqData.body.paypalDetails.create_time.substring(0, 10);

        const newOrder = await Database.order.create({
            order_date: order_date,
            order_status: "Ordine in lavorazione",
            shipping_address: order_address,
            shipping_cost: reqData.body.paypalDetails.purchase_units[0].amount.breakdown.shipping.value,
            paypal_fee: reqData.body.paypalDetails.purchase_units[0].amount.breakdown.tax_total.value,
            shipping_code: "",
            payment_method: 'PayPal',
            shipping_type: reqData.body.pickup ? 'Ritiro in sede' : 'Corriere',
            notes: "",
            userId: userCode.id,
        });

        reqData.body.paypalDetails.purchase_units[0].items.forEach(async item => {

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

    async createOrderBT(reqData){

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: reqData.user.UserInfo.username 
            }
        });

        if ( !userCode ) return [404, "Utente non trovato!"];

        const order_address = reqData.body.shipping_address + ' ' + reqData.body.hnumber + ' ' + 
                                    reqData.body.cap + ' ' + reqData.body.city + ' ' + reqData.body.province;

        const order_date = new Date().toJSON().slice(0, 10);

        const newOrder = await Database.order.create({
            order_date: order_date,
            order_status: "Ordine in lavorazione",
            shipping_address: order_address,
            shipping_cost: reqData.body.shipping_cost,
            payment_method: 'Bonifico',
            paypal_fee: 0,
            shipping_code: "",
            shipping_type: reqData.body.pickup ? 'Ritiro in sede' : 'Corriere',
            notes: "",
            userId: userCode.id,
        });
        
        reqData.body.cartItem.map(async item => {

            const newOrderProduct = await Database.order_product.create({
                qty: item.qty,
                priceEach: item.price,
                productId: item.id,
                orderId: newOrder.id,
            });

            await Database.product.decrement('qtyInStock', { 
                by: newOrderProduct.qty,
                where: {
                    id: item.id                    
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

        if ( !userCode ) return [404, "Utente non trovato!"] 

        const order = await Database.order_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal(process.env.ORDER_GROUP_BY_QUERY), 'order_total']],
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

        return[order.filter((v,i,a)=>a.findIndex(v2=>(v2['order.id']===v['order.id']))===i)
                    .sort((a, b) => a['order.order_date'] < b['order.order_date'] ? 1 : -1)];

    }

    async getOrderDetails(orderFE, req){
      
        const username = req.user.UserInfo.username;

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: username 
            }
        });

        if ( !userCode ) return [404, "Utente non trovato!"] 

        const order = await Database.order_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal(process.env.ORDER_GROUP_BY_QUERY), 'order_total'], 'qty', 'priceEach'],
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

    async getOrderList(filters){

        const order = await Database.order_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal(process.env.ORDER_GROUP_BY_QUERY), 'order_total']],
            include: [
                {
                    model: Database.order,
                    where: {
                        order_status: filters.status,
                    },
                    required: true,
                    attributes: ['id','order_status', 'order_date'],
                    order: [['order.order_date', 'DESC']],
                    include: [
                        { 
                            attributes:['email'],
                            model: Database.user,
                            required: true,                            
                        }
                    ]
                },
                {
                    model: Database.product,
                    required: true,
                    attributes: [],
                },
            ],
            group: ['order->user.id', 'order.id', 'product.id', 'qty', 'priceEach'],
            
            
        });

        if (!order) return [500, "Errore, impossibile recuperare gli ordini!"];

        const order_total_groupby = groupBy(order, 'order.id', 'order_total');

        order_total_groupby.forEach((item_gb) => {
            order.forEach((item_o) => {
                if(item_o['order.id'] === item_gb['order.id']) item_o['order_total'] = item_gb['order_total']
            })
        })

        return[order.sort((a, b) => a['order.order_date'] < b['order.order_date'] ? 1 : -1)];
    }

    async getOrderAdminDetails(orderID){

        const order = await Database.order_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal(process.env.ORDER_GROUP_BY_QUERY), 'order_total'], 'qty', 'priceEach'],
            include: [
                {
                    model: Database.order,
                    where: {
                        id: orderID,
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

    async editOrder(orderFE){

        if (!orderFE.id || !orderFE.editedShippingCode || !orderFE.editedDate || !orderFE.editedShippingCarrier ||
                !orderFE.editedStatus) return [500, "Errore, richiesta non formulata correttamente!"];

        const order = await Database.order.findOne({
            where: {
                id: orderFE.id,
            },
        })
        
        if( !order ) return[404, "Ordine non trovato!"];

        const editedOrder = await Database.order.update(
            { 
                shipping_code: orderFE.editedShippingCode, 
                order_date: orderFE.editedDate,
                shipping_carrier: orderFE.editedShippingCarrier,
                order_status: orderFE.editedStatus
            },
            {
                where: {
                    id: order.id
                }
            }         
        )

        if (!editedOrder[0]) return[500, "Errore, ordine non modificato!"];

        return[200,"Ordine modificato con successo!"];

    }

    async getRecentOrders(){
        
        const order = await Database.order_product.findAll({
            raw: true,
            limit: 20,
            attributes: [[Database.sequelize.literal(process.env.ORDER_GROUP_BY_QUERY), 'order_total']],
            include: [
                {
                    model: Database.order,
                    required: true,
                    attributes: ['order_status', 'order_date', 'id'],
                    order: [['order.order_date', 'DESC']],
                    where: {
                        order_date: {
                            [Op.gte]: moment().subtract(7, 'days').toDate()
                        },
                        order_status: {
                            [Op.notLike]: '%Ordine concluso',  
                        }
                    },
                    include: [
                        { 
                            model: Database.user,
                            required: true,
                            attributes:['email']
                        }
                    ]
                },
                {
                    model: Database.product,
                    required: true,
                    attributes: [],
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