import {
  AllowNull,
  AutoIncrement,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "notifications",
})
export class AppNotification extends Model<AppNotification> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public content: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public topic: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  public userId: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  public username: string;

  //TODO: remove time becuse there is (createdAt) property in DB:
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
