const Database = require('../model/database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

class User_controller{

    constructor(){};

    async register(userFE){
        
        const user = await Database.user.findOne({where: { username: userFE.username }});

        const cryptedPass = bcrypt.hashSync(userFE.password, parseInt(process.env.SALT_ROUNDS));

        if(user){
            return [409, 'Username già presente!']
        }else{
            const newCustomer = await Database.user.create({
                lastname: userFE.lastname,
                name: userFE.name,
                email: userFE.email,
                username: userFE.username,
                password: cryptedPass,
                role: userFE.role,
                verified: false
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