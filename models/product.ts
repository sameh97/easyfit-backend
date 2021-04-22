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
import { Category } from "./category";
import { Gym } from "./gym";

@Table({
  tableName: "products",
})
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
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
  public quantity: number;

  @AllowNull(false)
  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  public categoryID: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Gym)
  public gymId: number;
}
