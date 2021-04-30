import {
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType,
  AutoIncrement,
  AllowNull,
  HasOne,
  ForeignKey,
} from "sequelize-typescript";
import { AssociationOptions } from "sequelize/types";
import { Gym } from "./gym";
import { Job } from "./job";
import { Machine } from "./machines";

@Table({
  tableName: "Machine_scheduled_Job",
})
export class MachineScheduledJob extends Model<MachineScheduledJob> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  public startTime: Date;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  public isActive: Boolean;

  //TODO: check if (targetScheduleRepeat) needs to be a number
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public targetScheduleRepeat: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public currentRepeatCount: number;

  @HasOne(() => Job, {
    foreignKey: "jobID",
    as: "jobScheduled",
    onDelete: "CASCADE",
  } as AssociationOptions)
  public jobID: number;

  // @HasOne(() => Machine,
  // {  foreignKey: "jobID",
  // as: "jobScheduled",
  // onDelete: "CASCADE",} as AssociationOptions);
  // public machineID: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Machine)
  public machineID: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Gym)
  public gymId: number;
}
