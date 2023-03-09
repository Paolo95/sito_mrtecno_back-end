const router = require('express').Router();
const tokenVerify = require('../middlewares/tokenVerify');
const isAdmin = require('../middlewares/isAdmin');
const Review_controller = require('../controllers/review_controller');

const review_controller = new Review_controller();

router.post('/getProdReviews', async (req, res) => {

    const result = await review_controller.getProdReview(req.body);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/getProdReviewsStars', async (req, res) => {

    const result = await review_controller.getProdReviewStars(req.body);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/getProdReviewStarsByID', async (req, res) => {

    const result = await review_controller.getProdReviewStarsByID(req.body);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/reviewListByUserID', tokenVerify, async (req, res) => {

    const result = await review_controller.reviewListByUserID(req);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/newReview', tokenVerify, async (req, res) => {

    const result = await review_controller.newReview(req);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/reviewListAdmin', tokenVerify, isAdmin, async (req, res) => {

    const result = await review_controller.reviewListAdmin(req);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/reviewUserInfo', tokenVerify, async (req, res) => {

    const result = await review_controller.reviewUserInfo(req);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/reviewAdminInfo', tokenVerify, isAdmin, async (req, res) => {

    const result = await review_controller.reviewAdminInfo(req);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/editReviewUser', tokenVerify, async (req, res) => {

    const result = await review_controller.editReviewUser(req);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/editReply', tokenVerify, isAdmin, async (req, res) => {

    const result = await review_controller.editReply(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

router.post('/newReply', tokenVerify, isAdmin, async (req, res) => {

    const result = await review_controller.newReply(req);
    
    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
});

module.exports = router;