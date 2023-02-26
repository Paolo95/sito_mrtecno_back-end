const router = require('express').Router();

const Faq_controller = require('../controllers/faq_controller');
const faq_controller = new Faq_controller();
const tokenVerify = require('../middlewares/tokenVerify');

router.post('/getFaqs', async (req, res) => {

    const result = await faq_controller.getFaqs();

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/newFaq', tokenVerify, async (req, res) => {

    const result = await faq_controller.newFaq(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/updateFaq', tokenVerify, async (req, res) => {

    const result = await faq_controller.updateFaq(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/deleteFaq', tokenVerify, async (req, res) => {

    const result = await faq_controller.deleteFaq(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})


module.exports = router;