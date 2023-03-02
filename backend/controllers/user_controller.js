const Database = require('../model/database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

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
            let emailToken = jwt.sign(
                {
                    lastname: userFE.lastname,
                    name: userFE.name,
                    email: userFE.email,
                    username: userFE.username,
                    password: cryptedPass,
                    role: userFE.role,
                    refresh_token: '',
                },
                process.env.EMAIL_SECRET,
                {
                    expiresIn: '30m',
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

    async userConfirmation(decoded){

        const newCustomer = await Database.user.create({
                lastname: decoded.lastname,
                name: decoded.name,
                email: decoded.email,
                username: decoded.username,
                password: decoded.password,
                role: decoded.role,
                refresh_token: '',
            });
            
            if (!newCustomer){
                return [500, 'Errore nel server: impossibile inserire il nuovo utente!'];
            }else{
                return [200, 'Account verificato!']
            }
        
    }

    async userAuth(userFE){

        if(!userFE.username || !userFE.password) return [400, 'Username e/o password richieste'];

        const foundUser = await Database.user.findOne({ where: {username: userFE.username} });
        
        if (foundUser === null) return [401, 'Username e/o password errati o utente non attivato!'];

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

            const userRefreshed = await Database.user.update({ refresh_token: refreshToken }, { where: { id: foundUser.id }});

            if (userRefreshed === null) return [500, 'Impossibile salvare il refreshToken!'];

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

        const foundUser = await Database.user.findOne({ where: {refresh_token: refreshToken} });
        
        if (foundUser === null) return [403, 'Utente non autorizzato!'];

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

        const foundUser = await Database.user.findOne({ where: {refresh_token: refreshToken} });
        
        if (foundUser === null) {
            return [204, 'Nessun refresh token trovato!'];
        }

        const refreshTokenReset = await Database.user.update({ refresh_token: '' },{ where: {refresh_token: refreshToken} });
        if ( refreshTokenReset === null ) return [500, 'Errore nel server!']

        return [204, 'Refresh token eliminato!'];
    }

    async userRecovery(emailFE){

        const email = await Database.user.findOne({where: { email: emailFE.recEmail }});
        if( email === null ){ return [403,'Email non presente!'] }

        const randomPassword = Math.random().toString(36).slice(-10);
        const cryptedPass = bcrypt.hashSync(randomPassword, parseInt(process.env.SALT_ROUNDS));

        let emailToken = jwt.sign(
            {
                recEmail: emailFE.recEmail,
                password: cryptedPass,
            },
            process.env.USER_RECOVERY_SECRET,
            {
                expiresIn: '30m',
            });            
            
        const url = `http://localhost:5000/api/user/recoveryConfirmation/${emailToken}`;

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
            to: emailFE.recEmail,
            subject: 'MrTecno - Conferma la modifica della password!',
            html: `Per favore, conferma la modifica alla password cliccando sul link: <a href="${url}">${url}</a>
                        la password provvisoria è: <b>${randomPassword}</b>`
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
            return [200, 'Abbiamo inviato una mail con all\'interno la password provvissoria per confermare la modifica all\'account!'];
        }


    }

    async recoveryConfirmation(decoded){
        
        const user = await Database.user.findOne({where: { email: decoded.recEmail }});
 
        if(user === null){
            return [409, 'Username non presente!'];
        }
        
        const passUpdated = await Database.user.update({ password: decoded.password }, { where: { email: decoded.recEmail }});
        
        if (passUpdated === null){
            return [500, 'Errore nel server: impossibile aggiornare la password'];
        }

        return [200, 'Password modificata!'];

    }

    async passwordChange(reqFE){

        const username = reqFE.user.UserInfo.username;
        
        const user = await Database.user.findOne({
            attributes: ['id'],
            where: { username: username}
        });

        if (user === null) return [404, "Utente non trovato!"];

        const dbPwd = await Database.user.findOne({
            attributes: ['password'],
            where: { id: user.id}
        });

        const match = await bcrypt.compare(reqFE.body.oldPwd, dbPwd.password);

        if (!match){
            return [403, "La vecchia password è errata!"]
        }

        const cryptedPass = bcrypt.hashSync(reqFE.body.newPwd, parseInt(process.env.SALT_ROUNDS));

        const passUpdated = await Database.user.update({ password: cryptedPass }, { where: { id: user.id }});
              
        if (passUpdated === null){
            return [500, 'Errore nel server: impossibile aggiornare la password'];
        }

        return [200, "Password modificata con successo!"];

    }

    async deleteUser(reqFE){

        const username = reqFE.user.UserInfo.username;
        
        const user = await Database.user.findOne({
            attributes: ['id'],
            where: { username: username}
        });

        if (user === null) return [404, "Utente non trovato!"];

        const dbPwd = await Database.user.findOne({
            attributes: ['password'],
            where: { id: user.id}
        });

        const match = await bcrypt.compare(reqFE.body.password, dbPwd.password);

        if (!match){
            return [403, "La password è errata!"]
        }

        const order = await Database.order_product.findAll({
            raw: true,
            attributes: [],
            include: [
                {
                    attributes: ['id', 'order_status'],
                    model: Database.order,
                    where: {
                        userId: user.id
                    },
                    required: true,
                }
            ]
        });

        const orderFiltered = order.filter((v,i,a)=>a.findIndex(v2=>(v2['order.id']===v['order.id']))===i);

        let orderPending = false;

        orderFiltered.forEach((item) => {
            if (item['order.order_status'] === 'Ordine in lavorazione' || item['order.order_status'] === 'Ordine in spedizione'){
                orderPending = true;
            }
        })

        if (orderPending) { return [403, "Impossibile eliminare l'account se hai un ordine in lavorazione e/o spedizione!"] };
        
        const barterPending = await Database.barter.count({
            where: {
                userId: user.id,
                [Op.or]: [
                    { status: 'In lavorazione',},
                    { status: 'Valutazione effettuata',},
                    { status: 'Pagamento effettuato',},
                    { status: 'Oggetti ricevuti',},
                    { status: 'Prodotto spedito',},
                ]
            }
        }); 

        if (barterPending > 0) return [403, "Impossibile eliminare l'account se hai una permuta non conclusa!"]
        
        const deleteUser = await Database.user.destroy({ where: { id: user.id } });

        if (deleteUser === undefined) return [500, "Errore nel server!"]

        return [200,"Account eliminato con successo!"]
    }
}

    

module.exports = User_controller;