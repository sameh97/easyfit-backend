import { MachineScheduledJob } from "../models/machine-scheduled-job";

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

  public static createCronExpression = async (scheduledJob: MachineScheduledJob): Promise<string> => {
    const hours = AppUtils.hasValue(scheduledJob.hoursFrequency)
      ? `*/${scheduledJob.hoursFrequency}`
      : "*";

    let cronExp: string = `0 ${hours} * * *`;

     // if hour is not choosen, specify the job to run every 3 days:
    cronExp = cronExp === `0 * * * *` ? `0 */72 * * *` : cronExp;

    return cronExp;
  };
}
