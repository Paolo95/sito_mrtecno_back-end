const jwt = require('jsonwebtoken');

function emailTokenVerify(req, res, next){


    let token = req.params.token;

    if(!token){         
        return res.status(500).send('Accesso negato!');
    }
    
    try{
        const verified = jwt.verify(token, process.env.EMAIL_SECRET);
        req.user = verified;
        next();

    } catch(err){
        return res.status(403).send('ERRORE: Token non valido!');
    }

}


module.exports = emailTokenVerify;