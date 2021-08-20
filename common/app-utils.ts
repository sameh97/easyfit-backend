import { Console } from "winston/lib/winston/transports";
import { InputError } from "../exeptions/input-error";
import { AppNotification } from "../models/app-notification";
import { MachineScheduledJob } from "../models/machine-scheduled-job";
import { Consts } from "./consts";
import { SocketTopics } from "./socket-util";

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
    const daysFrequency = AppUtils.hasValue(scheduledJob.daysFrequency)
      ? `*/${scheduledJob.daysFrequency}`
      : "*";

    let cronExp: string = `0 0 ${daysFrequency} * *`;

    // if hour is not choosen, specify the job to run every 3 days:
    cronExp = cronExp === `0 0 * * *` ? `0 0 */3 * *` : cronExp;
    cronExp = `* * * * *`;
    return cronExp;
  };

  public static addDays = (date: Date, days: number): Date => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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

  public static createNotificationToStoreInDB = (
    scheduledJob: MachineScheduledJob
  ): AppNotification => {
    const topic: string =
      scheduledJob.jobID === 1
        ? SocketTopics.TOPIC_CLEAN_MACHINE
        : SocketTopics.TOPIC_MACHINE_SERVICE;

    const notificationToCreate: AppNotification = {
      content: JSON.stringify(scheduledJob),
      topic: topic,
      gymId: scheduledJob.gymId,
      seen: false,
      targetObjectId: scheduledJob.machineSerialNumber,
    } as unknown as AppNotification;

    return notificationToCreate;
  };
}
