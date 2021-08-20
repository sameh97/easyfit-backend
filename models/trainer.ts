import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    IsEmail,
    IsDate,
    Model,
    PrimaryKey,
    Table,
    Unique,
  } from "sequelize-typescript";
  import { Gym } from "./gym";
  @Table({
    tableName: "trainers",
  })
  export class Trainer extends Model<Trainer> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    public id: number;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    public firstName: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    public lastName: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    public phone: string;
  
    @AllowNull(false)
    @IsDate
    @Column(DataType.DATE)
    public birthDay: Date;
  
    @Unique
    @AllowNull(false)
    @IsEmail
    @Column(DataType.STRING)
    public email: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    public address: string;
  
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    public isActive: boolean;
  
    @IsDate
    @AllowNull(false)
    @Column(DataType.DATE)
    public joinDate: Date;
  
  
    @AllowNull(true)
    @Column(DataType.STRING)
    public imageURL?: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    public certificationDate:Date;
  
    @AllowNull(false)
    @Column(DataType.INTEGER)
    @ForeignKey(() => Gym)
    public gymId: number;
  }