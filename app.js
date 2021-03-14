const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2><center>sameh hassoun!!!!</center></h2>");
});

app.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(`${email}, ${password}`);
  res.send("hi");
 
  if(validate(email,password)){
    console.log(email);
    //   res.redirect('/home-page')
    //   fs.readFile('./home',null,(error,data) =>{
    //       if(error){
    //           res.writeHead(404);
    //           res.write('file not found!');
    //       }else{
    //           res.write(data);
    //       }
    //       res.end();
    //   }
    //   );
  }
 
});

function validate(email,password){
    if(email === 'abc' && password === '123'){
        return true;
    }
    return false;
}

module.exports = app;
