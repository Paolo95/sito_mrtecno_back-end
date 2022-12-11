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
                verified: false,
                refresh_token: '',
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
                { expiresIn: '4h'}
            );

            const userRefreshed = await Database.user.update({ refresh_token: refreshToken }, { where: { user_id: foundUser.user_id }});

            if (!userRefreshed) return [500, 'Impossibile salvare il refreshToken!'];

            return [refreshToken, accessToken];
            
        }else{
            return [401, 'Password errata!'];
        }
    }

    async refresh(cookiesFE){

        const cookies = cookiesFE;

        let accessToken = '';

        if(!cookies?.jwt) return [401, 'Cookies non presenti!'];

        const refreshToken = cookies.jwt;

        const foundUser = await Database.user.findOne({ where: {refresh_token: refreshToken, verified: 1} });
        
        if (!foundUser) return [403, 'Utente non autorizzato!'];

        let notValidRefreshToken = false;

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decoded){
            
            if ( err || foundUser.username !== decoded.username ) {
                notValidRefreshToken = true;
            }            

            accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "role": foundUser.role,
                    }                        
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1h'
                }
            );
    
        });                
        
        if (notValidRefreshToken === true) {
            return [403, 'Utente non autorizzato!'];
        }else{
            return [accessToken]; 
        }
        
            
    }

    async getUser(){

        const users = await Database.user.findAll();
        return [users[0].lastname]
    }

    async logOut(cookiesFE){

        const cookies = cookiesFE;

        if (!cookies?.jwt) return rreturn [204, 'Nessun refresh token trovato!'];
        const refreshToken = cookies.jwt;

        const foundUser = await Database.user.findOne({ where: {refresh_token: refreshToken, verified: 1} });
        
        if (!foundUser) {
            return [204, 'Nessun refresh token trovato!'];
        }

        const refreshTokenReset = await Database.user.update({ refresh_token: '' },{ where: {refresh_token: refreshToken, verified: 1} });
        if (!refreshTokenReset) return [500, 'Errore nel server!']

        return [204, 'Refresh token eliminato!'];
    }
}

    

module.exports = User_controller;