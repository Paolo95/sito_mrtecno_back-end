const router = require('express').Router();

const User_controller = require('../controllers/user_controller');
const user_controller = new User_controller();

router.post('/register', async (req, res) => {

    const result = await user_controller.register(req.body);
    res.status(result[0]).send(result[1]);
});

module.exports = router;