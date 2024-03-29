const jwt = require('jsonwebtoken');

function isAdmin(req, res, next){

    let token = req.header('Authorization');
    token = token.split(" ");

    if(!token){     
        return res.status(403).send('Accesso negato!');
    }

    try{
        const verified = jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET);
        if (verified.UserInfo.role === 'admin') {
            next();
        }else{
            return res.status(403).send('Non si posseggono le autorizzazioni per questo servizio!')
        }

    } catch(err){
        return res.status(403).send('ERRORE: Token non valido: ');
    }
}


module.exports = isAdmin;