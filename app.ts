// require("dotenv").config();
import express = require("express");

import * as jwt from "jsonwebtoken";
import { User } from "./models/user";
import { UsersRepository } from "./repositories/users-repository";
import { UserController } from "./controllers/user-controller";
import { UserService } from "./services/user-service";

const verifyToken = require("./middlewares/jwt-functions");
const secret = "secretKey";

const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const AppDBConnection = require("./config/database");
const userRepo = new UsersRepository();
const usersService = new UserService(userRepo);
const userController = new UserController(usersService);

app.use(express.json());

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

app.get("/api/login", (req, res) => {
  const user: User = req.body;

  userController.get(req, res);
});

app.post("/api/user", (req, res) => {
  const user: User = req.body;

  const createdUser = userRepo.save(user);
  res.send(createdUser);
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.body.token, secret, (err, authData) => {
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

module.exports = app;
