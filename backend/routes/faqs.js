const router = require('express').Router();

const Faq_controller = require('../controllers/faq_controller');
const faq_controller = new Faq_controller();

router.post('/getFaqs', async (req, res) => {

    const result = await faq_controller.getFaqs();

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

module.exports = router;