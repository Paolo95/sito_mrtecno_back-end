const Database = require('../model/database');
const dotenv = require('dotenv');
const MailGenerator = require('../utils/mailGenerator');
const mailGenerator = new MailGenerator();
const nodemailer = require("nodemailer");
const path = require('path');
const groupBy = require('group-by-with-sum');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
moment().tz("Europe/Rome").format();

dotenv.config();

class Barter_controller{

    constructor(){};

    async createBarter(reqData){
   
        const userInfo = await Database.user.findOne({
            attributes: ['id', 'email'], 
            where: { 
                    username: reqData.user.UserInfo.username
                }
            });
        
        if (!userInfo) return [404, "Utente non trovato"];

        const newBarter = await Database.barter.create({
            barter_date: moment.tz(moment(), 'Europe/Rome').format('YYYY-MM-DD'),
            barter_telephone: reqData.body.telephone,
            barter_items: reqData.body.barterItem,
            status: 'In lavorazione',
            userId: userInfo.id,
        });
        
        reqData.body.cartItem.map(async item => {

            const newBarterProduct = await Database.barter_product.create({
                qty: item.qty,
                priceEach: item.price,
                productId: item.id,
                barterId: newBarter.id,
            });

            await Database.product.decrement('qtyInStock', { 
                by: newBarterProduct.qty,
                where: {
                    id: item.id                    
                }
            })
        });   

        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS
            },
        });

        const basePath = path.join(__dirname, '../');

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: userInfo.email,
            subject: 'MrTecno - Proposta di permuta in valutazione',
            html: mailGenerator.newBarter(reqData.body.barterItem, newBarter.id),
            attachments: [{
                filename: 'mrtecnoLogo.jpeg',
                path: basePath + '/utils/emailImages/mrtecnoLogo.jpeg',
                cid: 'mrtecnoLogo'
                },
            ]
        };

        let errorPresent = false;

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                errorPresent = true;
            } else {
                errorPresent = false;
            }
        });
        
        if(errorPresent){
            return [500, 'Errore nel server!'];
        }else{
            return[newBarter];
        }

    }  

    async barterStatus(reqData){

        const barterStatus = await Database.barter.findOne({
            attributes: ['status'],
            where: { id: reqData.body.id}});
        
        if (!barterStatus) return [404, "Permuta non trovata!"];

        return[barterStatus];
    }

    async barterTotal(reqData){

        const barterTotal = await Database.barter.findOne({
            attributes: ['barter_evaluation'],
            where: { id: reqData.body.id}});
        
        if (!barterTotal) return [404, "Permuta non trovata!"];

        return[barterTotal];
    }

    async barterInfo(reqData){

        const username = reqData.user.UserInfo.username;

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: username 
            }
        });

        if ( !userCode ) return [404, "Utente non trovato!"] 

        const barter = await Database.barter_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total'], 'qty', 'priceEach'],
            include: [
                {
                    model: Database.barter,
                    where: {
                        userId: userCode.id,
                        id: reqData.body.id,
                    },
                    required: true,
                },
                {
                    model: Database.product,
                    required: true,
                },
            ],
            group: ['barter.id', 'product.id', 'qty', 'priceEach'],
        });

        if (!barter) return [500, "Errore, impossibile recuperare gli ordini!"];

        const barter_total_groupby = groupBy(barter, 'barter.id', 'barter_total');

        barter_total_groupby.forEach((item_gb) => {
            barter.forEach((item_o) => {
                if(item_o['barter.id'] === item_gb['barter.id']) item_o['barter_total'] = item_gb['barter_total']
            })
        })

        return[barter];

    }

    async barterAccepted(reqData){

        const shipping_address = reqData.body.paypalDetails.purchase_units[0].shipping.address.address_line_1 + " - " +
            reqData.body.paypalDetails.purchase_units[0].shipping.address.postal_code + " - " +
                reqData.body.paypalDetails.purchase_units[0].shipping.address.admin_area_1;
        
        const barterUpdated = await Database.barter.update(
            {
              status: "Pagamento effettuato",
              payment_method: "PayPal",
              shipping_type: "Corriere",
              shipping_address: shipping_address,
              shipping_carrier: "GLS",
              shipping_cost: reqData.body.paypalDetails.purchase_units[0].amount.breakdown.shipping.value,
              paypal_fee: reqData.body.paypalDetails.purchase_units[0].amount.breakdown.tax_total.value,
            },
            {
              where: { 
                id: reqData.body.barterCode,
            },
            }
          );

        if (!barterUpdated) return [500, "Errore nel server!"];

        const userInfo = await Database.user.findOne({
            attributes: ['email'],
            where: { username: reqData.user.UserInfo.username 
            }
        });

        if ( !userInfo ) return [404, "Utente non trovato!"];

        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS
            },
        });

        const basePath = path.join(__dirname, '../');

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: userInfo.email,
            subject: 'MrTecno - Riepilogo permuta',
            html: mailGenerator.barterPayPal(reqData, reqData.body.barterCode),
            attachments: [{
                filename: 'mrtecnoLogo.jpeg',
                path: basePath + '/utils/emailImages/mrtecnoLogo.jpeg',
                cid: 'mrtecnoLogo'
                },
            ]
        };

        let errorPresent = false;

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                errorPresent = true;
            } else {
                errorPresent = false;
            }
        });
        
        if(errorPresent){
            return [500, 'Errore nel server!'];
        }else{
            return [barterUpdated];
        }

    }

    async barterAcceptedStripe(reqData){

        const shipping_address = reqData.body.address + " " +
            reqData.body.hnumber + " - " +
                reqData.body.cap + " " + reqData.body.city;
        
        const barterUpdated = await Database.barter.update(
            {
              status: "Pagamento effettuato",
              payment_method: "Carta di credito",
              shipping_type: "Corriere",
              shipping_address: shipping_address,
              shipping_carrier: "GLS",
              shipping_cost: reqData.body.shipping_cost,
              paypal_fee: reqData.body.payment_fee,
            },
            {
              where: { 
                id: reqData.body.barterCode,
            },
            }
          );

        if (!barterUpdated) return [500, "Errore nel server!"];

        const userInfo = await Database.user.findOne({
            attributes: ['email'],
            where: { username: reqData.user.UserInfo.username 
            }
        });

        if ( !userInfo ) return [404, "Utente non trovato!"];

        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS
            },
        });

        const basePath = path.join(__dirname, '../');

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: userInfo.email,
            subject: 'MrTecno - Riepilogo permuta',
            html: mailGenerator.barterStripe(reqData, reqData.body.barterCode),
            attachments: [{
                filename: 'mrtecnoLogo.jpeg',
                path: basePath + '/utils/emailImages/mrtecnoLogo.jpeg',
                cid: 'mrtecnoLogo'
                },
            ]
        };

        let errorPresent = false;

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                errorPresent = true;
            } else {
                errorPresent = false;
            }
        });
        
        if(errorPresent){
            return [500, 'Errore nel server!'];
        }else{
            return [200, "Permuta registrata correttamente!"];
        }      
    

    }

    async barterAcceptedBT(reqData){
       
        const barterUpdated = await Database.barter.update(
            {
              status: "Pagamento effettuato",
              shipping_address: reqData.body.shipping_address + ' ' + reqData.body.hnumber + ' - ' + reqData.body.cap + ' - ' + reqData.body.city,
              shipping_carrier: "GLS",
              payment_method: "Bonifico",
              shipping_cost: reqData.body.shipping_cost,
              shipping_type: 'Corriere',
            },
            {
              where: { 
                id: reqData.body.barterCode,
            },
            }
          );

        if (!barterUpdated) return [500, "Errore nel server!"];

        const userInfo = await Database.user.findOne({
            attributes: ['email'],
            where: { username: reqData.user.UserInfo.username 
            }
        });

        if ( !userInfo ) return [404, "Utente non trovato!"];

        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS
            },
        });

        const basePath = path.join(__dirname, '../');

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: userInfo.email,
            subject: 'MrTecno - Riepilogo permuta',
            html: mailGenerator.barterBT(reqData, reqData.body.barterCode),
            attachments: [{
                filename: 'mrtecnoLogo.jpeg',
                path: basePath + '/utils/emailImages/mrtecnoLogo.jpeg',
                cid: 'mrtecnoLogo'
            }]
        };

        let errorPresent = false;

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                errorPresent = true;
            } else {
                errorPresent = false;
            }
        });
        
        if(errorPresent){
            return [500, 'Errore nel server!'];
        }else{
            return [barterUpdated];
        }

    }

    async barterList(reqData){
        
        if(reqData.body.numberSearched !== '' && reqData.body.emailSearched !== '' && reqData.body.idSearched !== ''){

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                            barter_telephone: reqData.body.numberSearched,
                            id: reqData.body.idSearched,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email'],
                                where: {
                                    email: {
                                        [Op.like]: reqData.body.emailSearched + '%',
                                    }
                                }
                            }
                        ],
                    },
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })
            
            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];

        }else if (reqData.body.numberSearched !== '' && reqData.body.emailSearched === '' && reqData.body.idSearched !== ''){

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                            id: reqData.body.idSearched,
                            barter_telephone: reqData.body.numberSearched,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email']
                            }
                        ],
                    },
                   
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })
            
            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];

        }else if (reqData.body.numberSearched !== '' && reqData.body.emailSearched === '' && reqData.body.idSearched === ''){

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                            barter_telephone: reqData.body.numberSearched,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email']
                            }
                        ],
                    },
                   
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })
            
            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];
        
        }else if (reqData.body.numberSearched === '' && reqData.body.emailSearched !== '' && reqData.body.idSearched !== ''){

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                            id: reqData.body.idSearched,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email'],
                                where: {
                                    email: {
                                        [Op.like]: reqData.body.emailSearched + '%',
                                    }
                                }
                            }
                        ],
                    },
                   
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })
            
            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];
        
        }else if (reqData.body.numberSearched === '' && reqData.body.emailSearched !== '' && reqData.body.idSearched === ''){

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email'],
                                where: {
                                    email: {
                                        [Op.like]: reqData.body.emailSearched + '%',
                                    }
                                }
                            }
                        ],
                    },
                   
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })
            
            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];
        
        }else if (reqData.body.numberSearched !== '' && reqData.body.emailSearched !== '' && reqData.body.idSearched === ''){

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                            barter_telephone: reqData.body.numberSearched,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email'],
                                where: {
                                    email: {
                                        [Op.like]: reqData.body.emailSearched + '%',
                                    }
                                }
                            }
                        ],
                    },
                   
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })
            
            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];
        
        }else if (reqData.body.numberSearched === '' && reqData.body.emailSearched === '' && reqData.body.idSearched !== ''){

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                            id: reqData.body.idSearched,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email']
                            }
                        ],
                    },
                   
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })
            
            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];

        }else{

            const barter = await Database.barter_product.findAll({
                raw: true,
                attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
                include: [
                    {
                        attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee', 'barter_telephone'],
                        model: Database.barter,
                        where: {
                            status: reqData.body.statusSelected,
                        },
                        required: true,
                        include: [
                            { 
                                model: Database.user,
                                required: true,
                                attributes:['email']
                            }
                        ],
                    },
                   
                ],
                group: ['barter.id', 'barter.user.id'],
            });
    
            if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 
    
            barter.forEach((item) => {
                item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
            })

            return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];
        }
        
    }

    async userBarterList(bodyFE){

        const userCode = await Database.user.findOne({
            where: {
                username: bodyFE.user.UserInfo.username
            }
        })

        if(!userCode) return [404, "Utente non trovato!"];

        const barter = await Database.barter_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total']],
            include: [
                {
                    attributes: ['id', 'barter_date', 'status', 'shipping_cost', 'paypal_fee'],
                    model: Database.barter,
                    where: {
                        userId: userCode.id
                    },
                    required: true,
                },
            ],
            group: ['barter.id'],
        });

        if (!barter) return [500, "Errore, impossibile recuperare le permute!"]; 

        barter.forEach((item) => {
            item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
        })
        
        return[barter.sort((a,b) => a['barter.barter_date'] < b['barter.barter_date'] ? 1 : -1)];
    }

    async barterDetailsWithProdInfo(barterID){

        const barter = await Database.barter_product.findAll({
            raw: true,
            attributes: [[Database.sequelize.literal(process.env.BARTER_GROUP_BY_QUERY), 'barter_total'], 'qty', 'priceEach'],
            include: [
                {
                    model: Database.barter,
                    required: true,
                    where: {
                        id: barterID,
                    },
                    order: [['barter.barter_date', 'DESC']],
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
                },
            ],
            group: ['barter.id', 'product.id', 'qty', 'priceEach', 'barter->user.id'],
            
        });

        if (!barter) return [500, "Errore, impossibile recuperare le permute!"];

        const barter_total_groupby = groupBy(barter, 'barter.id', 'barter_total');
       
        barter_total_groupby.forEach((item_gb) => {
            barter.forEach((item_o) => {
                if(item_o['barter.id'] === item_gb['barter.id']) item_o['barter_total'] = item_gb['barter_total']
            })
        })

        barter.forEach((item) => {
            item['barter_total'] = item['barter_total'] + item['barter.shipping_cost'] + item['barter.paypal_fee']
        })

        return[barter];

    }

    async editBarter(bodyFE){

        const barter = await Database.barter.findOne({
            raw: true,
            attributes: ['id'],
            include: [
                { 
                    attributes:['email'],
                    model: Database.user,
                    required: true,                            
                },
            ],
            where: {
                id: bodyFE.id,
            },
        });
        
        if( !barter ) return[404, "Permuta non trovata!"];

        const editedBarter = await Database.barter.update(
            { 
                shipping_code: bodyFE.editedShippingCode, 
                barter_date: bodyFE.editedDate,
                shipping_carrier: bodyFE.editedShippingCarrier,
                status: bodyFE.editedStatus,
                barter_evaluation: bodyFE.editedEvaluation,
                notes: bodyFE.editedNotes,
            },
            {
                where: {
                    id: barter.id
                }
            }         
        )

        if (!editedBarter[0]) return[500, "Errore, permuta non modificata!"];

        const barterUpd = await this.barterDetailsWithProdInfo(barter.id);

        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS
            },
        });

        const basePath = path.join(__dirname, '../');

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: barter['user.email'],
            subject: barterUpd[0][0]['barter.status'] === 'Valutazione effettuata' ? 'MrTecno - Permuta n. ' + barter.id + ' valutata!' :
                        'MrTecno - Aggiornamento permuta n. ' + barter.id ,
            html: barterUpd[0][0]['barter.status'] === 'Valutazione effettuata' ? mailGenerator.barterValued(barterUpd, barter.id) :
                    barterUpd[0][0]['barter.payment_method'] === 'PayPal' ? mailGenerator.barterPayPalUpdate(barterUpd, barter.id) :
                        barterUpd[0][0]['barter.payment_method'] === 'Bonifico' ? mailGenerator.barterBTUpdate(barterUpd, barter.id) :
                            barterUpd[0][0]['barter.payment_method'] === 'Carta di credito' ? mailGenerator.barterStripeUpdate(barterUpd, barter.id) :
                                null,
            attachments: [{
                filename: 'mrtecnoLogo.jpeg',
                path: basePath + '/utils/emailImages/mrtecnoLogo.jpeg',
                cid: 'mrtecnoLogo'
            }]
        };

        let errorPresent = false;

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                errorPresent = true;
            } else {
                errorPresent = false;
            }
        });
        
        if(errorPresent){
            return [500, 'Errore nel server!'];
        }else{
            return[200,"Permuta modificata con successo!"];
        }        

    }

    async getRecentBarters(){
        
        const barterList = await Database.barter.findAll({
            raw: true,
            limit: 20,
            attributes: ['barter_date', 'id'],
            include:
                { 
                    model: Database.user,
                    required: true,
                    attributes:['username']
                },
            where:
                {
                    barter_date: {
                        [Op.gte]: moment().subtract(7, 'days').toDate()
                    },
                    status: 'In lavorazione',
                }
            
        });

        if (!barterList) return [500, "Errore, impossibile recuperare le permute!"];

        return[barterList];
    }

    async barterRefused(reqData){

        const username = reqData.user.UserInfo.username;

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: username 
            }
        });

        if ( !userCode ) return [404, "Utente non trovato!"] 

        const barter = await Database.barter.findOne({
            raw: true,
            attributes: ['id'],
            where: {
                id: reqData.body.barterId,
                userId: userCode.id,
            },
        });
        
        if ( !barter ) return[403, "La permuta non è associata al tuo account!"];

        const editedBarter = await Database.barter.update(
            { 
                status: 'Rifiutata',
            },
            {
                where: {
                    id: barter.id
                }
            }         
        )

        if (!editedBarter[0]) return[500, "Errore, permuta non modificata!"];

        return[200,'Permuta rifiutata!'];
    }


}

module.exports = Barter_controller;