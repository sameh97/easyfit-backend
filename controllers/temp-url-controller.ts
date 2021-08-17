import { inject, injectable } from "inversify";
import { MemberDtoMapper } from "../common/dto-mapper/member-dto-mapper";
import { TempUrlDtoMapper } from "../common/dto-mapper/temp-url-dto-mapper";
import { Logger } from "../common/logger";
import { TempUrlDto } from "../models/dto/temp-url-dto";
import { Member } from "../models/member";
import { TempUrl } from "../models/temp-url";
import { TempUrlService } from "../services/temp-url-service";

@injectable()
export class TempUrlController {
  constructor(
    @inject(TempUrlService) private tempUrlService: TempUrlService,
    @inject(TempUrlDtoMapper) private tempUrlDtoMapper: TempUrlDtoMapper,
    @inject(Logger) private logger: Logger
  ) {}

  public getAll = async (req: any, res: any, next: any) => {
    try {
      const Urls: TempUrl[] = await this.tempUrlService.getAll(req.query.gymId);

      const tempUrlsDto: TempUrlDto[] = Urls.map((url) =>
        this.tempUrlDtoMapper.asDto(url)
      );

      next(tempUrlsDto);
    } catch (err) {
      this.logger.error(`cannot get all Temporary URLs`, err);
      next(err);
    }
  };

  public getByUUID = async (req: any, res: any, next: any) => {
    try {
      const catalogUrl: TempUrl = await this.tempUrlService.getByUUID(
        req.params.uuid
      );

      const tempUrlDto: TempUrlDto = this.tempUrlDtoMapper.asDto(catalogUrl);

      next(tempUrlDto);
    } catch (err) {
      this.logger.error(`cannot get Temporary URL`, err);
      next(err);
    }
  };

  public create = async (req: any, res: any, next: any) => {
    let tempUrlToCreate: TempUrl = null;
    try {
      tempUrlToCreate = this.tempUrlDtoMapper.asEntity(req.body);

      const createdTempUrl: TempUrl = await this.tempUrlService.create(
        tempUrlToCreate
      );

      res.status(201);

      next(this.tempUrlDtoMapper.asDto(createdTempUrl));
    } catch (err) {
      this.logger.error(
        `Cannot create Temporary URL ${JSON.stringify(req.body)}`,
        err
      );
      next(err);
    }
  };

  public update = async (req: any, res: any, next: any) => {
    let tempUrlToUpdate: TempUrl = null;
    try {
      tempUrlToUpdate = this.tempUrlDtoMapper.asEntity(req.body);

      const updatedTempUrl: TempUrl = await this.tempUrlService.update(
        tempUrlToUpdate
      );

      res.status(201);

      next(this.tempUrlDtoMapper.asDto(updatedTempUrl));
    } catch (err) {
      this.logger.error(
        `Cannot update Temporary URL ${JSON.stringify(req.body)}`,
        err
      );
      next(err);
    }
  };

  public delete = async (req: any, res: any, next: any) => {
    let uuid: string;
    try {
      uuid = req.query.uuid;

      await this.tempUrlService.delete(uuid);

      next(`Temporary URL with uuid ${uuid} has been deleted succesfuly`);
    } catch (err) {
      this.logger.error(`Cannot delete Temporary URL: ${uuid}`, err);
      next(err);
    }
  };
}
