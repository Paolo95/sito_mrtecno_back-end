const Database = require('../model/database');
const { Op } = require('sequelize');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

class Review_controller{

    constructor(){};

    async getProdReview(prodIdBody){

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

    async getProdReviewStars(){

        const prodStars = await Database.review.findAll({
            raw: true,
            attributes: ['productId', [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStars'], [Sequelize.fn('COUNT', Sequelize.col('productId')), 'reviewCount']],
            group: ['productId']
        });

        if(!prodStars) return[500, "Errore, impossibile trovare le informazioni delle recensioni!"];

        return[prodStars]
    }

    async getProdReviewStarsByID(bodyFE){

        const prodInfo = await Database.review.findAll({
            raw: true,
            attributes: ['productId', [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStars'], [Sequelize.fn('COUNT', Sequelize.col('productId')), 'reviewCount']],
            where: {
                productId: bodyFE.prod_id,
            },
            group: ['productId']
        });

        if(!prodInfo) return[500, "Errore, impossibile trovare le informazioni delle recensioni!"];

        return[prodInfo]
    }

}

module.exports = Review_controller;