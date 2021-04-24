import { inject, injectable } from "inversify";
import { TrainerDtoMapper } from "../common/dto-mapper/trainer-dto-mapper";
import { Logger } from "../common/logger";
import { TrainerDto } from "../models/dto/trainer-dto";
import { Trainer } from "../models/trainer";
import { TrainerService } from "../services/trainer-service";

@injectable()
export class TrainerController{
    constructor(
        @inject(TrainerService) private trainerService :TrainerService,
        @inject(TrainerDtoMapper) private trainerDtoMapper : TrainerDtoMapper,
        @inject(Logger) private logger : Logger
    ){}

    public getAll = async (req: any, res: any , next: any) => {
        try{
            const trainers : Trainer[] = await this.trainerService.getAll(
                req.query.gymId
            );

            const trainerDto : TrainerDto[] = trainers.map((trainer) =>
            this.trainerDtoMapper.asDto(trainer)
            );

            res.send(trainerDto);
        }catch (err) {
            this.logger.error(`cannot get all trainers`, err);
            next(err);
        }
    }

    public createTrainer = async (req :any, res : any , next: any) => {
        let TrainerToCreate: Trainer = null;
        try{
            TrainerToCreate = this.trainerDtoMapper.asEntity(req.body);

            const createdTrainer : Trainer = await this.trainerService.create(
                TrainerToCreate
            );

            res.status(201);

            next(this.trainerDtoMapper.asDto(createdTrainer));
        }catch (err) {
            this.logger.error(
                `Cannot create trainer ${JSON.stringify(req.body)}`,
                err
            );
            next(err);
        }
    }


    public Update = async (req: any, res: any, next:any) => {
        let trainerToUpdate: Trainer = null;

        try{
            trainerToUpdate = this.trainerDtoMapper.asEntity(res.body);

            const updateTrainer : Trainer = await this.trainerService.update(
                trainerToUpdate
            );

            res.status(201);

            res.send(this.trainerDtoMapper.asDto(updateTrainer));
        }catch (err) {
            this.logger.error(
                `Cannot update trainer ${JSON.stringify(req.body)}`,
                err
            );

            next(err);
        }
    }
    
    public delete = async (req:any, res: any,next: any) => {
        let trainerId: number = null;
        try{
            trainerId = Number(req.params.id);

            await this.trainerService.delete(trainerId);

            res.send(`trainer with id ${trainerId} has been deleted succesfuly`);
        }catch (err) {
            this.logger.error(`Cannot delete trainer: ${trainerId}`, err);
            next(err);
        }
    }
}
