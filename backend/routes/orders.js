const router = require('express').Router();
const jwt = require('jsonwebtoken');
const tokenVerify = require('../middlewares/tokenVerify');
const Order_controller = require('../controllers/order_controller');
const order_controller = new Order_controller();

router.post('/newOrder', tokenVerify, async (req, res) => {

    const result = await order_controller.createOrder(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

router.post('/userOrders', tokenVerify, async (req, res) => {

    const result = await order_controller.getUserOrders(req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

router.post('/orderDetails/:orderId', tokenVerify, async (req, res) => {

    const result = await order_controller.getOrderDetails(req.params.orderId, req);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

router.post('/orderList', tokenVerify, async(req, res) => {

    const result = await order_controller.getOrderList(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/orderAdminDetails/:orderID', tokenVerify, async (req, res) => {

    const result = await order_controller.getOrderAdminDetails(req.params.orderID);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
    
});

router.post('/editOrder', tokenVerify, async(req, res) => {

    const result = await order_controller.editOrder(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

router.post('/getRecentOrders', tokenVerify, async(req, res) => {

    const result = await order_controller.getRecentOrders(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.json(result[0]);
    }
})

module.exports = router;