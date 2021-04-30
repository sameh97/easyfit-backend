import { injectable } from "inversify";
import { MachineScheduledJob } from "../models/machine-scheduled-job";
const schedule = require("node-schedule");

@injectable()
export class JobScheduleManager {
  public runJob = async (scheduledJob: MachineScheduledJob): Promise<void> => {
    const job = schedule.scheduleJob(scheduledJob.startTime, () => {
      console.log(`machineID: ${scheduledJob.machineID}`);
    });
  };
}
