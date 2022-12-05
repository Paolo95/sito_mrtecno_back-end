const Database = require('../model/database');

class User_controller{

    constructor(){};

    async register(decoded){
        
        const user = await Database.user.findOne({where: { username: decoded.username }});
        
        if(user){
            return [409, 'Username già presente!']
        }else{
            return [200, 'Registrazione completata con successo!'];
        }
        
    }

}

module.exports = User_controller;