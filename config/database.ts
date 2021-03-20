import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";

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

    this.db.addModels([User]);
    await this.db.authenticate();
    await this.db.sync();
  }
}

module.exports = new AppDBConnection();
