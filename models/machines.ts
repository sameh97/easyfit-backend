import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { AssociationOptions } from "sequelize/types";
import { Gym } from "./gym";
import { MachineScheduledJob } from "./machine-scheduled-job";
import { MachineType } from "./machine-type";

@Table({
  tableName: "machines",
})
export class Machine extends Model<Machine> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public description: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public productionYear: number;

  //TODO: check if supplier name & production company is needed
  @AllowNull(true)
  @Column(DataType.STRING)
  public supplierName?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  public productionCompany?: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public price: number;

  //TODO: make allow null false:
  @AllowNull(true)
  @Column(DataType.STRING)
  @ForeignKey(() => MachineType)
  public type?: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Gym)
  public gymId: number;

  @HasMany(() => MachineScheduledJob, {
    foreignKey: "jobID",
    as: "jobScheduled",
    onDelete: "CASCADE",
  } as AssociationOptions)
  public machineScheduledJobs: MachineScheduledJob[];
}