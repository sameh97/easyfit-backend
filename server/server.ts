// require("dotenv").config();
import express = require("express");
import * as jwt from "jsonwebtoken";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users-repository";
import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/user-service";
import { AppDBConnection } from "../config/database";
import { inject } from "inversify";
const verifyToken = require("../middlewares/jwt-functions");
const secret = "secretKey";
const bodyParser = require("body-parser");
const path = require("path");
const userRepo = new UsersRepository();
const usersService = new UserService(userRepo);
const userController = new UserController(usersService);

export class EasyFitApp {
  private app: express.Express;

  constructor(@inject(AppDBConnection) private dBconnection: AppDBConnection) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Expose-Headers", "*");
      next();
    });
  }

  public start(): void {
    this.initDB();
    this.listenToRequests();
    this.handleAllRequests();
  }

  public async initDB(): Promise<void> {
    this.dBconnection
      .connect()
      .then((r) => {
        console.log("success: " + JSON.stringify(r));
      })
      .catch((e) => {
        console.log(e);
      });
  }

  private listenToRequests(): void {
    const http = require("http");

    const PORT = process.env.APP_PORT || 3000;

    const server = http.createServer(this.app);

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  }

  private handleAllRequests(): void {
    this.app.get("/api", (req, res) => {
      res.json({
        message: "Hey there! welcome to this API service",
      });
    });

    this.app.post("/api/login", async (req, res) => {
      const user = req.body;

      const result = await userController.get(user, res);

      res.setHeader("Authorization", result);
      res.send({});
    });

    this.app.post("/api/user", verifyToken, (req, res) => {
      const user: User = req.body;

      const createdUser = userRepo.save(user);
      res.send(createdUser);
    });

    this.app.post("/api/posts", verifyToken, (req, res) => {
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
  }
}
