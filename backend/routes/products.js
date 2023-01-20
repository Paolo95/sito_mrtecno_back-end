const router = require('express').Router();
const jwt = require('jsonwebtoken');
const tokenVerify = require('../middlewares/tokenVerify');

const Product_controller = require('../controllers/product_controller');

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

router.post('/filteredAdminItems', tokenVerify, async (req, res) => {

    const result = await product_controller.getAdminFilteredItems(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

router.post('/checkAvailability', tokenVerify, async (req, res) => {
    
    const result = await product_controller.getAvailability(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }

})

router.post('/getProduct', tokenVerify, async (req,res) => {
    
    const result = await product_controller.getProduct(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    } 
})

router.post('/getProductShop', async (req,res) => {
    
    const result = await product_controller.getProductShop(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    } 
})

router.post('/editProduct', tokenVerify, async (req, res) => {

    const result = await product_controller.editProduct(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    } 
})

router.post('/delProduct', tokenVerify, async (req, res) => {

    const result = await product_controller.delProduct(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    } 
})

router.post('/newProduct', tokenVerify, async (req, res) => {

    const result = await product_controller.newProduct(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    } 

})

module.exports = router;