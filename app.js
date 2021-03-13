const express = require('express');

const app = express();

app.use((req,res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-type, Accept, Authoriztion");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    }
})

app.get('/', (req,res) => {
    res.send('<h2><center>sameh hassoun!!!!</center></h2>');
});

module.exports = app;


