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

    const result = await user_controller.userConfirmation(decoded);
    //res.status(result[0]).json(result[1]);

    return res.redirect('http://localhost:3000/logsuccess');

});

module.exports = router;