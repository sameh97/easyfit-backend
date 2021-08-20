import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
// import { Gym } from "./gym";
import { Product } from "./product";
import { TempUrl } from "./temp-url";
@Table({
  tableName: "catalog",
})
export class Catalog extends Model<Catalog> {
  @ForeignKey(() => Product)
  @Column
  public productID: number;

  @ForeignKey(() => TempUrl)
  @Column
  public tempUrlID: string;

  // @AllowNull(false)
  // @Column(DataType.INTEGER)
  // @ForeignKey(() => Gym)
  // public gymId: number;
}
