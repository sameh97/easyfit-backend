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
  @Column(DataType.INTEGER)
  public gymId: number;

  // @AllowNull(true)
  // @Column(DataType.STRING)
  // public username: string;

  //TODO: remove time becuse there is (createdAt) property in DB:
  // @AllowNull(false)
  // @Column(DataType.DATE)
  // public time: Date;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  public seen: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  public targetObjectId: string;
  
  // TODO: check if this is relevant
}
