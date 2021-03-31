import express = require("express");
import { AppDBConnection } from "../config/database";
import { inject } from "inversify";
import { Logger } from "./../common/logger";
import { UsersApi } from "../routes/users.api";
const verifyToken = require("../middlewares/jwt-functions");
const secret = "secretKey";
const bodyParser = require("body-parser");
const path = require("path");

// TODO: arrange the imports and make them cleaner
export class EasyFitApp {
  private app: express.Express;

  constructor(
    @inject(UsersApi) private usersApi: UsersApi,
    @inject(AppDBConnection) private dBconnection: AppDBConnection,
    @inject(Logger) private logger: Logger
  ) {
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
    this.initRoutes();
    this.initDB();
    this.listenToRequests();
  }

  private initRoutes(): void {
    this.app.use(this.usersApi.getRouter());
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
}
