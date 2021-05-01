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
    @inject(JobScheduleManager)
    private jobScheduleManager: JobScheduleManager
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
  }

  public start(): void {
    //TODO: make a user
    this.initRoutes();
    this.handleAllResponses();
    this.initDB();
    this.listenToRequests();
    //  this.machineSchedulerService.enableAllSchedules();
    //   this.addStaticJob();
    this.jobScheduleManager.runAllScheduledJobs();
  }
  //TODO: remove:
  private addStaticJob = async () => {
    const job1 = {
      title: "clean",
      description: "clean!!!!!!",
    };

    const createdJob = await Job.create(job1);

    console.log(createdJob);
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

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  }
}
