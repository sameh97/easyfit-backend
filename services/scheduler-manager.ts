import { inject, injectable } from "inversify";
import { AppUtils } from "../common/app-utils";
import { NotFound } from "../exeptions/notFound-exeption";
import { MachineScheduledJob } from "../models/machine-scheduled-job";
import { MachineSchedulerRepository } from "../repositories/scheduler-repository";

const schedule = require("node-schedule");

@injectable()
export class JobScheduleManager {
  public allJobs = new Map();
  constructor(
    @inject(MachineSchedulerRepository)
    private machineSchedulerRepository: MachineSchedulerRepository
  ) {}

  public runJob = async (scheduledJob: MachineScheduledJob): Promise<void> => {
    let cronExp = await AppUtils.createCronExpression(scheduledJob);

    console.log(cronExp);

    const job = schedule.scheduleJob(
      {
        start: scheduledJob.startTime,
        end: scheduledJob.endTime,
        rule: cronExp,
      },
      () => {
        console.log("Time for tea!");
      }
    );
  };

  public runAllScheduledJobs = async (): Promise<void> => {
    const currentJobs: MachineScheduledJob[] = await this.machineSchedulerRepository.getAllWithoutGymId();

    if (!AppUtils.hasValue(currentJobs) || currentJobs.length === 0) {
      console.log(`there is not jobs to run!`);
      return;
    }

    currentJobs.forEach(async (job) => {
      this.allJobs.set(job.id, job);

      let cronExp = await AppUtils.createCronExpression(job);

      const jobEnabled = schedule.scheduleJob(
        {
          start: job.startTime,
          end: job.endTime,
          rule: cronExp,
        },
        () => {
          console.log("Time for tea!");
        }
      );
    });
  };
}
