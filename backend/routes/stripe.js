const router = require('express').Router();
const jwt = require('jsonwebtoken');
const tokenVerify = require('../middlewares/tokenVerify');
const Stripe_controller = require('../controllers/stripe_controller');
const stripe_controller = new Stripe_controller();



router.post('/config', tokenVerify, async(req, res) => {

    const result = await stripe_controller.getPubKey();

    res.send(result[0]);
    
    
})

router.post('/createPaymentIntent', tokenVerify, async(req, res) => {

    const result = await stripe_controller.getPaymentIntent(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.send( result[0] );
    }   
    
})


module.exports = router;