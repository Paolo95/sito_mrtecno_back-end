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

    async reviewListByUserID(reqData){

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { 
                username: reqData.user.UserInfo.username 
            }
        });

        if ( !userCode ) return [404, "Utente non trovato!"];

        if (reqData.body.status === 'Da compilare') {

            const productList = await Database.order_product.findAll({
                raw: true,
                attributes: ['productId'],
                include: [
                    {
                        attributes: [],
                        model: Database.order,
                        required: true,
                        where: {
                            userId: userCode.id
                        }
                    }
                ]
            });

            if(!productList) return [500,"Errore, non è possibile recuperare i prodotti acquistati!"];

            const productListArray = productList.map(item => item.productId);

            const reviewListNotPresent = await Database.review.findAll({
                attributes: ['productId'],
                where: {
                    userId: userCode.id,
                }
            })

            const productListPresentArray = reviewListNotPresent.map(item => item.productId);

            const productListToReview = productListArray.filter(item => !productListPresentArray.includes(item));

            const productListToReviewNames = await Database.product.findAll({
                attributes: ['id', 'product_name'],
                where: {
                    id: {[Op.in]: productListToReview}
                }
            })

            return[productListToReviewNames]

        } else {

            const reviewList = await Database.review.findAll({
                raw: true,
                attributes: ['id', 'review_date', 'review_text', 'stars'],
                include: [
                    {
                        attributes: ['product_name'],
                        model: Database.product,
                        required: true,
                    }
                ],
                where: {
                    userId: userCode.id,
                },
                order: [['review_date','DESC']]
            });

            return[reviewList];
            
        }

    }

    async newReview(reqData){

        const userCode = await Database.user.findOne({
            attributes: ['id'],
            where: { username: reqData.user.UserInfo.username 
            }
        });

        if ( !userCode ) return [404, "Utente non trovato!"];

        const review_date = new Date().toJSON().slice(0, 10);

        const newReview = await Database.review.create({
            review_date: review_date,
            review_text: reqData.body.reviewText,
            stars: reqData.body.reviewStars,
            productId: reqData.body.productId,
            userId: userCode.id,
        });

        if(!newReview) return[500, "Impossibile inserire la recensione!"]

        return[200, "Recensione inserita correttamente!"];
    }

    async reviewListAdmin(reqData){

        if (reqData.body.status === 'Da rispondere') {

            const reviewList = await Database.review.findAll({
                raw: true,
                attributes:['id', 'review_text', 'review_reply', 'stars'],
                where:{
                    review_reply: '',
                },
                include: [
                    {
                        required: true,
                        model: Database.user,
                        attributes: ['username'],
                    },
                ]
              
            });

            if(!reviewList) return[500,"Errore, non è possibile recuperare le recensioni!"];

            return[reviewList];

        } else {
            const reviewList = await Database.review.findAll({
                where:{
                    review_reply: {[Op.not]: ''},
                }
              
            });

            if(!reviewList) return[500,"Errore, non è possibile recuperare le recensioni!"];

            return[reviewList];
        }
        
    }

    async reviewUserInfo(reqData){

        const reviewInfo = await Database.review.findOne({
            attributes:['id', 'review_date', 'review_reply', 'review_text', 'stars'],
            where: {
                id: reqData.body.id,
            }
        })

        return[reviewInfo];
    }

    async reviewAdminInfo(reqData){

        const reviewInfo = await Database.review.findOne({
            attributes:['id', 'review_date', 'review_reply', 'review_text', 'stars'],
            where: {
                id: reqData.body.id,
            }
        })

        return[reviewInfo];
    }

    async editReviewUser(reqData){

        const reviewModified = await Database.review.update(
            {
                review_text: reqData.body.reviewText,
                stars: reqData.body.reviewStars,
            },
            {
                where: {
                    id: reqData.body.id
                },
            }
            
        );

        if(!reviewModified[0]) return[500, "Impossibile modificare la recensione!"];

        return[200, "Recensione modificata correttamente!"];
    }

    async editReply(reqData){

        const reviewModified = await Database.review.update(
            {
                review_reply: reqData.body.replyText,
            },
            {
                where: {
                    id: reqData.body.id
                },
            }
            
        );

        if(!reviewModified[0]) return[500, "Impossibile modificare la risposta!"];

        return[200, "Risposta modificata correttamente!"];
    }

    async newReply(reqData){
        
        const newReply = await Database.review.update(
            {
                review_reply: reqData.body.replyText
            },
            {
                where: {
                    id: reqData.body.id,
                }
            }
        )

        if(!newReply[0]) return[500, "Impossibile inserire la risposta!"];

        return[200, "La risposta è stata inserita correttamente!"];
    }

}

module.exports = Review_controller;