const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const database = require ('./model/database');
const userRoute = require('./routes/users');
const productRoute = require('./routes/products');
const allowedOrigins = require('./config/allowedOrigins');
const cors = require('cors');

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true
}

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/user', userRoute);
app.use('/api/product', productRoute);

app.get("/", (req,res) => {
    res.send("MrTecno server is running!");
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

dbConnection();

async function dbConnection(){
       
    try {

        await database.sequelize;
        console.log('Connessione stabilita correttamente');
    
        await database.sequelize.sync();
        console.log("Sincronizzazione effettuta!"); 
    } catch (error) {
        console.error('Impossibile stabilire una connessione, errore: ', error);
    }
};