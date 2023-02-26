const Database = require('../model/database');
const dotenv = require('dotenv');
const { sequelize } = require('../model/database');

dotenv.config();

class Faq_controller{

    constructor(){};

    async getFaqs(){

        const faqList = await Database.faq.findAll();

        if ( !faqList ) return [500, "Errore server, impossibile recuparare le faq!"];

        return [faqList];
    }  

    async newFaq(bodyFE){

        const newFaq = await Database.faq.create({
            
            question: bodyFE.newQuestion,
            answer: bodyFE.newAnswer,
        });

        if ( !newFaq ) return [500, "Errore server, impossibile creare la faq!"];

        return [200, "La FAQ è stata creata correttamente!"];
    }
    
    async updateFaq(bodyFE){

        const editedFaq = await Database.faq.update(
            { 
                answer: bodyFE.answer,
                question: bodyFE.question,  
            },
            {
                where: {
                    id: bodyFE.id
                }
            }         
        )

        if (!editedFaq[0]) return[500, "Errore: la FAQ non è stata modificata!"]

        return [200, "La FAQ è stata modificata correttamente!"];
    }
    
    async deleteFaq(bodyFE){

        const deletedFaq = await Database.faq.destroy({
            where: {
                id: bodyFE.id
            }
        })

        if(!deletedFaq) return[500, "Errore: cancellazione della FAQ non eseguita!"];

        return[200, "FAQ cancellata con successo!"];
    }

}

module.exports = Faq_controller;