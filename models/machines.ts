import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Gym } from "./gym";
import {MachineType} from './machine-type';

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
}


