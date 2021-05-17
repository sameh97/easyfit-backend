import { inject, injectable } from "inversify";
import { AppUtils } from "../common/app-utils";
import { InputError } from "../exeptions/input-error";
import { NotFound } from "../exeptions/notFound-exeption";
import { MachineScheduledJob } from "../models/machine-scheduled-job";
import { MachineSchedulerRepository } from "../repositories/scheduler-repository";
import { JobService } from "./job-service";

const schedule = require("node-schedule");
@injectable()
export class JobScheduleManager {
  public allJobs = new Map();
  constructor(
    @inject(MachineSchedulerRepository)
    private machineSchedulerRepository: MachineSchedulerRepository,
    @inject(JobService) private jobService: JobService
  ) {}

  //TODO: cancel job also in case the end time is arrived

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
        this.jobService.send(scheduledJob);
        console.log("sent notification");
      }
    );

    this.allJobs.set(scheduledJob.id, job);
  };

  public cancelJob = async (jobID: number): Promise<void> => {
    if (!AppUtils.isInteger(jobID)) {
      throw new InputError(
        `cannot cancel job because the givin id must be integer`
      );
    }
    //TODO: add more validations and log info
    const jobToCancel = this.allJobs.get(jobID);

    if (!AppUtils.hasValue(jobToCancel)) {
      console.log(`cannot cancel job because its not found`);
      return;
    }

    jobToCancel.cancel();

    this.allJobs.delete(jobID);
  };

  public runAllScheduledJobs = async (): Promise<void> => {
    const currentJobs: MachineScheduledJob[] =
      await this.machineSchedulerRepository.getAllWithoutGymId();

    if (!AppUtils.hasValue(currentJobs) || currentJobs.length === 0) {
      console.log(`there is no jobs to run!`);
      return;
    }

    currentJobs.forEach(async (job) => this.runJob(job));
  };
}
