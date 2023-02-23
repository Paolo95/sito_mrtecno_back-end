const router = require('express').Router();
const tokenVerify = require('../middlewares/tokenVerify');

const Barter_controller = require('../controllers/barter_controller');
const barter_controller = new Barter_controller();

router.post('/createBarter', tokenVerify, async (req, res) => {

    const result = await barter_controller.createBarter(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterStatus', tokenVerify, async (req, res) => {

    const result = await barter_controller.barterStatus(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterTotal', tokenVerify, async (req, res) => {

    const result = await barter_controller.barterTotal(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterInfo', tokenVerify, async (req, res) => {

    const result = await barter_controller.barterInfo(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterAccepted', tokenVerify, async (req, res) => {

    const result = await barter_controller.barterAccepted(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})
router.post('/barterList', tokenVerify, async (req, res) => {
    
    const result = await barter_controller.barterList(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

module.exports = router;