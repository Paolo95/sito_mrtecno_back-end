const router = require('express').Router();
const jwt = require('jsonwebtoken');
const emailTokenVerify = require('../middlewares/emailTokenVerify');
const tokenVerify = require('../middlewares/tokenVerify');

const Product_controller = require('../controllers/product_controller');
const recoveryTokenVerify = require('../middlewares/recoveryTokenVerify');
const product_controller = new Product_controller();

router.get('/categories', async (req, res) => {

    const result = await product_controller.getCategories();

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

router.post('/brands', async (req, res) => {

    const result = await product_controller.getBrands(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

router.post('/filteredItems', async (req, res) => {

    const result = await product_controller.getFilteredItems(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

module.exports = router;