import { inject, injectable } from "inversify";
import { Logger } from "../common/logger";
import { Gym } from "../models/gym";
import { GymDtoMapper } from "./../common/dto-mapper/gym-dto-mapper";
import { GymService } from "./../services/gym-service";

@injectable()
export class GymController {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(GymDtoMapper) private gymDtoMapper: GymDtoMapper,
    @inject(GymService) private gymService: GymService
  ) {}

  public createGym = async (req: any, res: any, next: any) => {
    let gymToCreate: Gym = null;
    try {
      gymToCreate = this.gymDtoMapper.asEntity(req.body);

      const createdGym: Gym = await this.gymService.create(gymToCreate);

      res.status(201);

      next(this.gymDtoMapper.asDto(createdGym));
    } catch (err) {
      this.logger.error(
        `Cannot create gym ${JSON.stringify(gymToCreate)}`,
        err
      );
      next(err);
    }
  };
}
