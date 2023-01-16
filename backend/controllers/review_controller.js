const Database = require('../model/database');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Sequelize } = require('sequelize');
const MimeNode = require('nodemailer/lib/mime-node');

dotenv.config();

class Review_controller{

    constructor(){};

    async getProdReview(prodIdBody){

        console.log(prodIdBody.orderRevChoice)
        if (prodIdBody.orderRevChoice === 'Migliori'){
            
            const review = await Database.review.findAll({
                raw: true,
                attributes: ['id', 'review_date', 'review_text', 'review_reply' ,'stars', 'user.username'],
                include: [
                    {
                        attributes: ['username'],
                        model: Database.user,
                        required: true,
                    },
                    {
                        attributes: ['product_name'],
                        model: Database.product,
                        where: {
                            id: prodIdBody.prod_id,
                        },
                        required: true,
                    },
                ],
                order: [
                    ['stars', 'DESC']
                ],
            });

            return [review];

        } else if (prodIdBody.orderRevChoice === 'Peggiori'){

            const review = await Database.review.findAll({
                raw: true,
                attributes: ['id', 'review_date', 'review_text', 'review_reply' ,'stars', 'user.username'],
                include: [
                    {
                        attributes: ['username'],
                        model: Database.user,
                        required: true,
                    },
                    {
                        attributes: ['product_name'],
                        model: Database.product,
                        where: {
                            id: prodIdBody.prod_id,
                        },
                        required: true,
                    },
                ],
                order: [
                    ['stars', 'ASC']
                ],
            });

            return [review];
        } else if (prodIdBody.orderRevChoice === 'Recenti'){

            const review = await Database.review.findAll({
                raw: true,
                attributes: ['id', 'review_date', 'review_text', 'review_reply' ,'stars', 'user.username'],
                include: [
                    {
                        attributes: ['username'],
                        model: Database.user,
                        required: true,
                    },
                    {
                        attributes: ['product_name'],
                        model: Database.product,
                        where: {
                            id: prodIdBody.prod_id,
                        },
                        required: true,
                    },
                ],
                order: [
                    ['review_date', 'DESC']
                ],
            });

            return [review];
        }

    }

}

module.exports = Review_controller;