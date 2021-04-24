import { inject, injectable } from "inversify";
import { MachineDtoMapper } from "../common/dto-mapper/machine-dto-mapper";
import { Logger } from "../common/logger";
import { MachineDto } from "../models/dto/machine-dto";
import { Machine } from "../models/machines";
import { MachinesService } from "../services/machines-service";

@injectable()
export class MachinesController {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(MachinesService) private machinesService: MachinesService,
    @inject(MachineDtoMapper) private machineDtoMapper: MachineDtoMapper
  ) {}

  public getAll = async (req: any, res: any, next: any) => {
    try {
      const machines: Machine[] = await this.machinesService.getAll(
        req.query.gymId
      );

      const machinesDto: MachineDto[] = machines.map((machine) =>
        this.machineDtoMapper.asDto(machine)
      );

      next(machinesDto);
    } catch (err) {
      this.logger.error(`cannot get all machines`, err);
      next(err);
    }
  };

  public createMachine = async (req: any, res: any, next: any) => {
    let machineToCreate: Machine = null;
    try {
      machineToCreate = this.machineDtoMapper.asEntity(req.body);

      const createdMachine: Machine = await this.machinesService.create(
        machineToCreate
      );

      res.status(201);

      next(this.machineDtoMapper.asDto(createdMachine));
    } catch (err) {
      this.logger.error(
        `Cannot create machine ${JSON.stringify(req.body)}`,
        err
      );
      next(err);
    }
  };

  public update = async (req: any, res: any, next: any) => {
    let machineToUpdate: Machine = null;
    try {
      machineToUpdate = this.machineDtoMapper.asEntity(req.body);

      const updatedMachine: Machine = await this.machinesService.update(
        machineToUpdate
      );

      res.status(201);

      next(this.machineDtoMapper.asDto(updatedMachine));
    } catch (err) {
      this.logger.error(
        `Cannot update machine ${JSON.stringify(req.body)}`,
        err
      );
      next(err);
    }
  };

  public delete = async (req: any, res: any, next: any) => {
    let machineId: number;
    try {
      machineId = Number(req.query.id);

      await this.machinesService.delete(machineId);

      next(`machine with id ${machineId} has been deleted succesfuly`);
    } catch (err) {
      this.logger.error(`Cannot delete machine: ${machineId}`, err);
      next(err);
    }
  };
}
