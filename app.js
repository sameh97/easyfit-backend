const express = require("express");

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const secret = "secretKey";

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

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

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
