export class MachineScheduledJobDto {
  public id: number;
  public startTime: Date;
  public endTime: Date;
  public isActive: Boolean;
  public hoursFrequency: number;
  public jobID: number;
  public machineID: number;
  public gymId: number;
}
