const Database = require('../model/database');
const dotenv = require('dotenv');
const { sequelize } = require('../model/database');

dotenv.config();

class Faq_controller{

    constructor(){};

    async getFaqs(){

        const faqList = await Database.faq.findAll();

        if ( !faqList ) return [500, "Errore server, impoossibile recuparare le faq!"];

        return [faqList];
    }  

}

module.exports = Faq_controller;