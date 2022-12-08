const router = require('express').Router();
const jwt = require('jsonwebtoken');
const tokenVerify = require('../middlewares/tokenVerify');

const User_controller = require('../controllers/user_controller');
const user_controller = new User_controller();

router.post('/register', async (req, res) => {

    const result = await user_controller.register(req.body);
    res.status(result[0]).send(result[1]);
});

router.get('/confirmation/:token', tokenVerify, async (req, res) => {

    let token = req.params.token;
    const decoded = jwt.decode(token, process.env.EMAIL_SECRET);

    await user_controller.userConfirmation(decoded);

    return res.redirect('http://localhost:3000/regsuccess');

});

router.post('/auth', async (req, res) => {

    const result = await user_controller.userAuth(req.body);

    if(typeof(result[0]) == 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.cookie('jwt', result[0], { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        const role = result[1]
        const accessToken = result[2];
        res.json({role, accessToken});
    }
})

module.exports = router;