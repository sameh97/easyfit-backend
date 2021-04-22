import {
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType,
  AutoIncrement,
  AllowNull,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import { AssociationOptions } from "sequelize/types";
import { Member } from "./member";
import { Product } from "./product";
import { User } from "./user";

@Table({
  tableName: "gym",
})
export class Gym extends Model<Gym> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public address: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public phone: string;

  @HasOne(() => User, {
    foreignKey: "gymId",
    as: "userGym",
    onDelete: "CASCADE",
  } as AssociationOptions)
  public user: User;

  @HasMany(() => Member, {
    foreignKey: "gymId",
    as: "membersGym",
    onDelete: "CASCADE",
  } as AssociationOptions)
  public members: Member[];

  @HasMany(() => Product, {
    foreignKey: "gymId",
    as: "productsGym",
    onDelete: "CASCADE",
  } as AssociationOptions)
  public products: Product[];
}
