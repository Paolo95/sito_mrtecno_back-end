const router = require('express').Router();
const jwt = require('jsonwebtoken');
const emailTokenVerify = require('../middlewares/emailTokenVerify');
const tokenVerify = require('../middlewares/tokenVerify');
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

module.exports = router;