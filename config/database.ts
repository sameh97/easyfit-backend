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
import { Role } from "../models/role";
import { GroupTraining } from "../models/group-training";
import { MemberParticipate } from "../models/member-participate";

@injectable()
export class AppDBConnection {
  private db: Sequelize;

  async connect(): Promise<void> {
    this.db = new Sequelize({
      database: "da7gm7p7a39g69",
      dialect: "postgres",
      username: "kjroflheztorzs",
      password: "ae22f8ccd1ec96392d8f99275d87d58eff44f5c8c8de0f7fe15bf026bcf7a2ec",
      host: "ec2-54-224-120-186.compute-1.amazonaws.com",
      port: 5432,
      ssl: true
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
      Role,
      GroupTraining,
      MemberParticipate,
    ]);
    await this.db.authenticate();
    await this.db.sync(); // TODO: remove in production
  }
  //{ force: true }

  public async createTransaction(): Promise<Transaction> {
    return await this.db.transaction();
  }
}
