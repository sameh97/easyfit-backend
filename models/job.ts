import {
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType,
  AutoIncrement,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import { AssociationOptions } from "sequelize/types";
import { MachineScheduledJob } from "./machine-scheduled-job";

@Table({
  tableName: "job",
})
export class Job extends Model<Job> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public title: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public description: string;

  @HasMany(() => MachineScheduledJob, {
    foreignKey: "jobID",
    as: "jobScheduled",
    onDelete: "CASCADE",
  } as AssociationOptions)
  public machineScheduledJobs: MachineScheduledJob[];
}
