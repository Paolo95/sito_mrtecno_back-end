const router = require('express').Router();
const tokenVerify = require('../middlewares/tokenVerify');
const isAdmin = require('../middlewares/isAdmin');

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

    const result = await barter_controller.barterAccepted(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterAcceptedBT', tokenVerify, async (req, res) => {

    const result = await barter_controller.barterAcceptedBT(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterList', tokenVerify, isAdmin, async (req, res) => {
    
    const result = await barter_controller.barterList(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/userBarterList', tokenVerify, async (req, res) => {
    
    const result = await barter_controller.userBarterList(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterDetails/:barterID', tokenVerify, async (req, res) => {
    
    const result = await barter_controller.barterDetailsWithProdInfo(req.params.barterID);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/barterDetailsWithProduct/:barterID', tokenVerify, async (req, res) => {
    
    const result = await barter_controller.barterDetailsWithProdInfo(req.params.barterID);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/editBarter', tokenVerify, isAdmin , async (req, res) => {
    
    const result = await barter_controller.editBarter(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

module.exports = router;