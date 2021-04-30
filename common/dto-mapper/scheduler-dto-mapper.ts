import { injectable } from "inversify";
import { MachineScheduledJobDto } from "../../models/dto/scheduler-dto";
import { MachineScheduledJob } from "../../models/machine-scheduled-job";
import { AppUtils } from "../app-utils";

@injectable()
export class MachineScheduleDtoMapper {
  public asDto(scheduledJob: MachineScheduledJob): MachineScheduledJobDto {
    if (!AppUtils.hasValue(scheduledJob)) {
      return null;
    }

    return {
      id: scheduledJob.id,
      startTime: scheduledJob.startTime,
      isActive: scheduledJob.isActive,
      targetScheduleRepeat: scheduledJob.targetScheduleRepeat,
      currentRepeatCount: scheduledJob.currentRepeatCount,
      jobID: scheduledJob.jobID,
      machineID: scheduledJob.machineID,
      gymId: scheduledJob.gymId,
    } as MachineScheduledJobDto;
  }

  public asEntity(
    machineScheduledJobDto: MachineScheduledJobDto
  ): MachineScheduledJob {
    if (!AppUtils.hasValue(machineScheduledJobDto)) {
      return null;
    }

    return {
      id: machineScheduledJobDto.id,
      startTime: machineScheduledJobDto.startTime,
      isActive: machineScheduledJobDto.isActive,
      targetScheduleRepeat: machineScheduledJobDto.targetScheduleRepeat,
      currentRepeatCount: machineScheduledJobDto.currentRepeatCount,
      jobID: machineScheduledJobDto.jobID,
      machineID: machineScheduledJobDto.machineID,
      gymId: machineScheduledJobDto.gymId,
    } as MachineScheduledJob;
  }
}
