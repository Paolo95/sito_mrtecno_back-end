const router = require('express').Router();
const jwt = require('jsonwebtoken');
const emailTokenVerify = require('../middlewares/emailTokenVerify');
const tokenVerify = require('../middlewares/tokenVerify');

const User_controller = require('../controllers/user_controller');
const recoveryTokenVerify = require('../middlewares/recoveryTokenVerify');
const user_controller = new User_controller();

router.post('/register', async (req, res) => {

    const result = await user_controller.register(req.body);
    res.status(result[0]).send(result[1]);
});

router.get('/confirmation/:token', emailTokenVerify, async (req, res) => {

    let token = req.params.token;
    const decoded = jwt.decode(token, process.env.EMAIL_SECRET);

    result = await user_controller.userConfirmation(decoded);

    res.redirect(`http://localhost:3000/regsuccess/${result[0]}`);
    
    

});

router.post('/auth', async (req, res) => {

    const result = await user_controller.userAuth(req.body);

    if(typeof(result[0]) === 'number'){
        res.status(result[0]).send(result[1]);
    }else{

        res.cookie('jwt', result[0], { httpOnly: true, sameSite: 'None', secure:true, maxAge: 24 * 60 * 60 * 1000 });
        const accessToken = result[1];
        res.json({accessToken});
    }
})

router.get('/refresh', async (req, res) => {

    const result = await user_controller.refresh(req.cookies);
    
    if(typeof(result[0]) === 'number'){
        res.json({accessToken: '', role: '', username: ''});
    }else{
        
        res.json({accessToken: result[0]});
    }
})

router.get('/getUser', tokenVerify, async (req, res) => {

    const result = await user_controller.getUser();
    res.json(result[0]);
})

router.get('/logout', async (req, res) => {

    const result = await user_controller.logOut(req.cookies);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(result[0]).send(result[1]);
});

router.post('/userRecovery', async (req, res) => {

    const result = await user_controller.userRecovery(req.body);
    res.status(result[0]).send(result[1]);
});

router.get('/recoveryConfirmation/:token', recoveryTokenVerify ,async (req, res) => {
    
    let token = req.params.token;
    const decoded = jwt.decode(token, process.env.USER_RECOVERY_SECRET);

    const result = await user_controller.recoveryConfirmation(decoded);
    
    res.redirect(`http://localhost:3000/pwdUpdSuccess/${result[0]}`);
    
})

module.exports = router;