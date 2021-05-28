import { injectable } from "inversify";
import { Model } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "notifications",
})
@injectable()
export class AppNotification extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.JSON)
  public content: any;

  @AllowNull(false)
  @Column(DataType.STRING)
  public topic: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public userId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public username: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  public time: Date;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  public seen: boolean;

  // TODO: change allowNull:
  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.STRING))
  public targetUserIds: string[]; // TODO: check if this is relevant
}
