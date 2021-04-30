export class MachineScheduledJobDto {
  public id: number;
  public startTime: Date;
  public isActive: Boolean;
  public targetScheduleRepeat: number;
  public currentRepeatCount: number;
  public jobID: number;
  public machineID: number;
  public gymId: number;
}
