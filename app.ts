// require("dotenv").config();
import express = require("express");

import * as jwt from "jsonwebtoken";
const verifyToken = require("./middlewares/jwt-functions");
const secret = "secretKey";

const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const AppDBConnection = require("./config/database");

AppDBConnection.connect()
  .then((r) => {
    console.log("success: " + JSON.stringify(r));
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/api", (req, res) => {
  res.json({
    message: "Hey there! welcome to this API service",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, secret, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Posts created...",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = { id: 1, username: "John", email: "john@gmail.com" };

  jwt.sign({ user: user }, secret, (err, token) => {
    res.json({
      token,
    });
  });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

module.exports = app;
