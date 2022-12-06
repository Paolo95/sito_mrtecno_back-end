const Database = require('../model/database');

class User_controller{

    constructor(){};

    async register(userFE){
        
        const user = await Database.user.findOne({where: { username: userFE.username }});
        
        console.log(userFE.lastname)
        
        if(user){
            return [409, 'Username già presente!']
        }else{
            const newCustomer = await Database.user.create({
                lastname: userFE.lastname,
                name: userFE.name,
                email: userFE.email,
                username: userFE.username,
                password: userFE.password,
                role: userFE.role
            })

            if (!newCustomer){
                return [500, 'ERRORE SERVER: impossibile creare l\'utente'];
            }else{
                return [200, 'Registrazione completata con successo!'];
            }
            
        }
        
       
    }

}

module.exports = User_controller;