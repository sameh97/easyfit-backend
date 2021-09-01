import { injectable, inject } from "inversify";
import { AppUtils } from "../common/app-utils";
import { NotFound } from "../exeptions/notFound-exeption";
import { WebSocketService } from "./socket.io-service";

@injectable()
export class CacheService {
  public connectionsMap = new Map<string, any>();

  constructor() {}

  public set = (key: string, value: any) => {
    if (!AppUtils.hasValue(key)) {
      throw new NotFound(`cannot add becase the key is null`);
    } else if (!AppUtils.hasValue(value)) {
      throw new NotFound(`cannot add becasee the valu is null`);
    } else {
      this.connectionsMap.set(key, value);
    }
  };

  public delete = (key: string) => {
    if (!AppUtils.hasValue(key)) {
      throw new NotFound(`cannot delete becase the key is null`);
    }
    this.connectionsMap.delete(key);
  };

  public get = (key: string) => {
    if (!AppUtils.hasValue(key)) {
      throw new NotFound(`cannot get becase the key is null`);
    }
    return this.connectionsMap.get(key);
  };
}
