const express = require('express');
const dotenv = require('dotenv');
const products = require ('./config/mySql');

dotenv.config()

const app = express();

app.get("/", (req,res) => {
    res.send("API is running");
});

app.get("/api/products", (req,res) => {
    res.send("API is running");
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on port ${PORT}`));