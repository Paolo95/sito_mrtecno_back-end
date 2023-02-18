const Database = require('../model/database');
const dotenv = require('dotenv');
const { sequelize } = require('../model/database');

dotenv.config();

class Barter_controller{

    constructor(){};

    async createBarter(bodyFE){
     
        const userCode = await Database.user.findOne({
            attributes: ['id'], 
            where: { 
                    username: bodyFE.user.UserInfo.username
                }
            });
        
        if (!userCode) return [404, "Utente non trovato"];

        const productCode = await Database.product.findOne({
            attributes: ['id'],
            where: { 
                    product_name: bodyFE.body.modelChoice
                }
            });
        
        if (!productCode) return [404, "Prodotto non trovato"];

        const newBarter = await Database.barter.create({
            barter_date: new Date().toISOString().slice(0, 10),
            barter_telephone: bodyFE.body.telephone,
            barter_items: bodyFE.body.barterItem,
            status: 'In lavorazione',
            userId: userCode.id,
            productId: productCode.id,
        });

        if (!newBarter) return [500, "Permuta non registata correttamente!"];

        return [newBarter];
    }  

    async barterStatus(bodyFE){

        const barterStatus = await Database.barter.findOne({
            attributes: ['status'],
            where: { id: bodyFE.body.id}});
        
        if (!barterStatus) return [404, "Permuta non trovata"];

        return[barterStatus];
    }

    async barterTotal(bodyFE){

        const barterTotal = await Database.barter.findOne({
            attributes: ['total'],
            where: { id: bodyFE.body.id}});
        
        if (!barterTotal) return [404, "Permuta non trovata"];

        return[barterTotal];
    }

}

module.exports = Barter_controller;