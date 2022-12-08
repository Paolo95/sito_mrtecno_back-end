const Database = require('../model/database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

dotenv.config();

class User_controller{

    constructor(){};

    async register(userFE){
        
        const user = await Database.user.findOne({where: { username: userFE.username }});
        const email = await Database.user.findOne({where: { email: userFE.email }});

        const cryptedPass = bcrypt.hashSync(userFE.password, parseInt(process.env.SALT_ROUNDS));

        if(user){
            return [409, 'Username già presente!']
        }else if (email){
            return [409, 'Email già presente!']
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
                let emailToken = jwt.sign(
                    {
                        user: userFE.username,
                    },
                    process.env.EMAIL_SECRET,
                    {
                        expiresIn: '1d',
                    });            
                    
                const url = `http://localhost:5000/api/user/confirmation/${emailToken}`

                let transporter = nodemailer.createTransport({
                    service: process.env.EMAIL_SERVICE,
                    host: 'smtp.gmail.com',
                    secure: false,
                    auth: {
                      user: process.env.USER_EMAIL,
                      pass: process.env.USER_PASS
                    },
                  });

                const mailOptions = {
                    from: process.env.USER_EMAIL,
                    to: userFE.email,
                    subject: 'MrTecno - Conferma la tua e-mail!',
                    html: `Per favore, conferma la tua email cliccando sul link: <a href="${url}">${url}</a>`
                };

                let errorPresent = false;

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        errorPresent = true;
                    } else {
                        errorPresent = false;
                    }
                  });
                
                  if(errorPresent){
                    return [500, 'Errore nel server!'];
                  }else{
                    return [200, 'Abbiamo inviato una mail di conferma al tuo indirizzo di posta elettronica per la verifica!'];
                  }
                  
            }
            
        }
        
       
    }

    async userConfirmation(decoded){

        const user = await Database.user.findOne({where: { username: decoded.user }});

        if(!user){
            return [409, 'Username non presente!'];
        }
        
        const userVerified = await Database.user.update({ verified: 1 }, { where: { user_id: user.user_id }});
        
        if (!userVerified){
            return [500, 'Errore nel server: impossibile verificare la mail'];
        }

        return[200, 'Email verificata!']
    }

    async userAuth(userFE){
        
        if(!userFE.username || !userFE.password) return [400, 'Username e/o password richieste'];

        const foundUser = await Database.user.findOne({ where: {username: userFE.username, verified: 1} });
        
        if (!foundUser) return [401, 'Username e/o password errati o utente non attivato!'];

        const match = await bcrypt.compare(userFE.password, foundUser.password);
        
        if (match){
            
            const role = foundUser.role;

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d'}
            );

            foundUser.refreshToken = refreshToken;

            // const result = await foundUser.save();

            return [refreshToken, role, accessToken];
            
        }else{
            return [401, 'Password errata!'];
        }
    }
}

module.exports = User_controller;