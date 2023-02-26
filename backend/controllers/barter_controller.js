const Database = require('../model/database');
const dotenv = require('dotenv');
const { sequelize } = require('../model/database');

dotenv.config();

class Barter_controller{

    constructor(){};

    async createBarter(bodyFE){

        if (!bodyFE.body.telephone === undefined || !bodyFE.body.barterItem === undefined)
            return [500, "Errore, la richiesta non è stata formulata correttamente!"];
     
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

        if(!bodyFE.body.id) return [500, "Errore, la richiesta non è stata formulata correttamente!"]

        const barterStatus = await Database.barter.findOne({
            attributes: ['status'],
            where: { id: bodyFE.body.id}});
        
        if (!barterStatus) return [404, "Permuta non trovata!"];

        return[barterStatus];
    }

    async barterTotal(bodyFE){

        if(!bodyFE.body.id) return [500, "Errore, la richiesta non è stata formulata correttamente!"]

        const barterTotal = await Database.barter.findOne({
            attributes: ['total'],
            where: { id: bodyFE.body.id}});
        
        if (!barterTotal) return [404, "Permuta non trovata!"];

        return[barterTotal];
    }

    async barterInfo(bodyFE){

        if(!bodyFE.id) return [500, "Errore, la richiesta non è stata formulata correttamente!"]

        const productId = await Database.barter.findOne({
            attributes: ['productId'],
            where: {
                id: bodyFE.id
            }
        })

        if(!productId) return [404, "Prodotto non trovato!"]

        const barterInfo = await Database.barter.findOne({
            raw: true,
            include: [
                {
                    attributes: ['product_name', 'status'],
                    model: Database.product,
                    where: {
                        id: productId.productId
                    },
                    required: true,
                },
            ],
            where: { 
                id: bodyFE.id
            }});
        
        if (!barterInfo) return [404, "Permuta non trovata"];

        return[barterInfo];
    }

    async barterAccepted(bodyFE){

        if(!bodyFE.barterCode) return [500, "Errore, la richiesta non è stata formulata correttamente!"]
        
        const barterUpdated = await Database.barter.update(
            {
              status: "Pagamento effettuato",
            },
            {
              where: { 
                id: bodyFE.barterCode,
            },
            }
          );

        if (!barterUpdated) return [500, "Errore nel server!"];

        return[barterUpdated];
    }

    async barterList(bodyFE){

        if(!bodyFE.status) return [500, "Errore, la richiesta non è stata formulata correttamente!"]

        const barter = await Database.barter.findAll({
            raw: true,
            attributes: ['id', 'status', 'total', 'barter_date', 'barter_items'],
            include: [
                { 
                    attributes:['email'],
                    model: Database.user,
                    required: true,                            
                }
            ],
            where: [
                {
                    status: bodyFE.status,
                }
            ],
            order: [
                ['barter_date', 'DESC']
            ]
            
        });

        if (!barter) return [500, "Errore, impossibile recuperare le permute!"];
        
        return[barter];
    }

    async barterDetails(barterID){

        const barter = await Database.barter.findAll({
            where: {
                id: barterID,
            }
        })

        return [barter];
    }

    async editBarter(bodyFE){

        console.log(bodyFE)

        if ( !bodyFE.id || !bodyFE.editedShippingCode === undefined || !bodyFE.editedDate ||
                !bodyFE.editedShippingCarrier === undefined || !bodyFE.editedStatus ||
                    !bodyFE.editedTotal) return [500, 'Errore, la richiesta non è formulata correttamente!']

        const barter = await Database.barter.findOne({
            where: {
                id: bodyFE.id,
            },
        })
        
        if( !barter ) return[404, "Permuta non trovata!"];

        const editedBarter = await Database.barter.update(
            { 
                shipping_code: bodyFE.editedShippingCode, 
                barter_date: bodyFE.editedDate,
                shipping_carrier: bodyFE.editedShippingCarrier,
                status: bodyFE.editedStatus,
                total: bodyFE.editedTotal,
            },
            {
                where: {
                    id: barter.id
                }
            }         
        )

        if (!editedBarter[0]) return[500, "Errore, permuta non modificata!"];

        return[200,"Permuta modificata con successo!"];

    }


}

module.exports = Barter_controller;