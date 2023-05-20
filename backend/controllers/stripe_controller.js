const Database = require('../model/database');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
})

class Stripe_controller{

    constructor(){};
    
    async getPubKey(){

        return[{ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY }];
    }

    async getPaymentIntent(reqData){

        const paymentIntent = await stripe.paymentIntents.create({
            currency: "eur",
            amount: Math.round(reqData.body.total * 100),
            payment_method_types: ['card'],
            description: 'Ordine utente: ' + reqData.user.UserInfo.username,
        });

        if (!paymentIntent) return[400, "Impossibile recuperare il paymentIntent!"];

        return [paymentIntent.client_secret];
    }

}

module.exports = Stripe_controller;