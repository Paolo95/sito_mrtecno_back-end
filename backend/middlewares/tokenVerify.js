const jwt = require('jsonwebtoken');

function tokenVerify(req, res, next){


    let token = req.header('Authorization');

    if(!token){     
        return res.status(403).send('Accesso negato!');
    }

    token = token.split(" ");
    
    try{
        const verified = jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();

    } catch(err){
        return res.status(403).send('ERRORE: Token non valido!');
    }

}


module.exports = tokenVerify;