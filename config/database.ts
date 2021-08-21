import { injectable } from "inversify";
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import { Transaction } from "sequelize/types";
import { Gym } from "../models/gym";
import { Member } from "../models/member";
import { Trainer } from "../models/trainer";
import { Product } from "../models/product";
import { Machine } from "../models/machines";
import { MachineScheduledJob } from "../models/machine-scheduled-job";
import { Job } from "../models/job";
import { AppNotification } from "../models/app-notification";
import { Category } from "../models/category";
import { Catalog } from "../models/catalog";
import { TempUrl } from "../models/temp-url";
import { Bill } from "../models/bill";

@injectable()
export class AppDBConnection {
  private db: Sequelize;

  async connect(): Promise<void> {
    this.db = new Sequelize({
      database: "easy_fit",
      dialect: "postgres",
      username: "postgres",
      password: "postgres",
      host: "localhost",
      port: 5432,
    });

    this.db.addModels([
      User,
      Gym,
      Member,
      Trainer,
      Product,
      Machine,
      MachineScheduledJob,
      Job,
      AppNotification,
      Category,
      TempUrl,
      Catalog,
      Bill,
    ]);
    await this.db.authenticate();
    await this.db.sync(); // TODO: remove in production
  }
  //{ force: true }

  public async createTransaction(): Promise<Transaction> {
    return await this.db.transaction();
  }
}
