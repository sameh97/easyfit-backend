import express = require("express");
import { AppDBConnection } from "../config/database";
import { inject } from "inversify";
import { Logger } from "./../common/logger";
import { UsersApi } from "../routes/users.api";
import { MembersApi } from "../routes/members.api";
import { GymApi } from "../routes/gym.api";
import { TrainersApi } from "../routes/trainers.api";
import { ProductsApi } from "../routes/products.api";
import { appResponseHandler } from "./../middlewares/app-response-handler";
import { MachinesApi } from "../routes/machines.api";
import { MachineSchedulerService } from "../services/scheduler-service";
import { MachineSchedulerApi } from "../routes/scheduler.api";
import { Job } from "../models/job";
import { JobScheduleManager } from "../services/scheduler-manager";
import { Transaction } from "sequelize/types";
import * as cors from "cors";

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
    @inject(Logger) private logger: Logger,
    @inject(MembersApi) private membersApi: MembersApi,
    @inject(GymApi) private gymApi: GymApi,
    @inject(ProductsApi) private productsApi: ProductsApi,
    @inject(MachinesApi) private machinesApi: MachinesApi,
    @inject(TrainersApi) private trainersApi: TrainersApi,
    @inject(MachineSchedulerApi)
    private machineSchedulerApi: MachineSchedulerApi,
    @inject(MachineSchedulerService)
    private machineSchedulerService: MachineSchedulerService,
    @inject(JobScheduleManager) private jobScheduleManager: JobScheduleManager
  ) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "DELETE, POST, GET, PUT, PATCH, OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Expose-Headers", "*");
      next();
    });
    this.app.use(cors());
  }

  public async start(): Promise<void> {
    //TODO: make a user
    this.initRoutes();
    this.handleAllResponses();
    this.initDB();
    this.listenToRequests();
    this.addStaticJob();
    this.jobScheduleManager.runAllScheduledJobs();
  }

  //TODO: remove:
  private addStaticJob = async (): Promise<void> => {
    const job1: Job = {
      id: null,
      title: "clean",
      description: "clean!!!!!!",
      machineScheduledJobs: undefined,
    } as Job;

    let transaction: Transaction = null;
    try {
      transaction = await this.dBconnection.createTransaction();

      const createdJob = await Job.create(job1, { transaction: transaction });

      transaction.commit();
    } catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      console.log(error);
    }
  };

  private initRoutes(): void {
    this.app.use(this.usersApi.getRouter());
    this.app.use(this.membersApi.getRouter());
    this.app.use(this.gymApi.getRouter());
    this.app.use(this.trainersApi.getRouter());
    this.app.use(this.productsApi.getRouter());
    this.app.use(this.machinesApi.getRouter());
    this.app.use(this.machineSchedulerApi.getRouter());
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

  private handleAllResponses(): void {
    this.app.use(appResponseHandler);
  }

  private listenToRequests(): void {
    const http = require("http");

    const PORT = process.env.APP_PORT || 3000;

    const server = http.createServer(this.app);

    const io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });

    io.on("connection", (socket) => {
      console.log("a user connected");
    });

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  }
}
