import { Console } from "winston/lib/winston/transports";
import { InputError } from "../exeptions/input-error";
import { MachineScheduledJob } from "../models/machine-scheduled-job";
import { Consts } from "./consts";

export class AppUtils {
  public static hasValue(obj: any): boolean {
    if (typeof obj === "undefined" || obj === null) {
      return false;
    }
    return true;
  }

  public static getFullException(err: Error): string {
    if (!err) return "";
    return `${err.message}, stack: ${err.stack}`;
  }

  public static isInteger(obj: any): boolean {
    if (!AppUtils.hasValue(obj)) {
      return false;
    }
    if (!isNaN(obj) && Number.isInteger(obj)) {
      return true;
    }
    return false;
  }

  public static createCronExpression = async (
    scheduledJob: MachineScheduledJob
  ): Promise<string> => {
    const hours = AppUtils.hasValue(scheduledJob.hoursFrequency)
      ? `*/${scheduledJob.hoursFrequency}`
      : "*";

    let cronExp: string = `0 ${hours} * * *`;

    // if hour is not choosen, specify the job to run every 3 days:
    cronExp = cronExp === `0 * * * *` ? `0 */72 * * *` : cronExp;

    return cronExp;
  };

  public static validteScheduledJobEndDate = async (
    scheduleJob: MachineScheduledJob
  ): Promise<void> => {
    const dateNow = new Date(),
      endTimeToCompare = new Date(scheduleJob.endTime);

    // if the end date passed allready, or if the end job cant run at least one time then throw exeption:
    if (endTimeToCompare < dateNow) {
      throw new InputError(`the scheduled job end time is not valid`);
    }

    const difference: number = endTimeToCompare.getTime() - dateNow.getTime();

    if (
      difference < Consts.HOUR_IN_MILLISECONDS &&
      endTimeToCompare.getHours() === dateNow.getHours()
    ) {
      throw new InputError(`the scheduled job end time is not valid, because it will finish after less than 1 hour 
      (the schedule will never fire in this case)`);
    }
  };
}
