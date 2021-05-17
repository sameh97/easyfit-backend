import { injectable, inject } from "inversify";
import { AppUtils } from "../common/app-utils";
import { Consts } from "../common/consts";
import { InputError } from "../exeptions/input-error";
import { NotFound } from "../exeptions/notFound-exeption";
import { MachineScheduledJob } from "../models/machine-scheduled-job";
import { WebSocketService } from "./socket.io-service";
import { SocketTopics } from "./../common/socket-util";
import { MachineScheduleDtoMapper } from "../common/dto-mapper/scheduler-dto-mapper";
import { AppNotificationMessage } from "../models/dto/app-notification-message";

@injectable()
export class JobService {
  constructor(
    @inject(WebSocketService) private webSocketService: WebSocketService,
    @inject(MachineScheduleDtoMapper)
    private machineScheduleDtoMapper: MachineScheduleDtoMapper
  ) {}

  public send = async (schedueledJob: MachineScheduledJob): Promise<void> => {
    if (!AppUtils.hasValue(schedueledJob)) {
      throw new NotFound(
        `cannot send job because scheduled job object is not found`
      );
    }

    const topic = this.getTopicByJobId(schedueledJob.jobID);
    const notificationToSend = this.createNotification(schedueledJob, topic);

    this.webSocketService.socketIO.emit(topic, notificationToSend);
  };

  private createNotification(
    schedueledJob: MachineScheduledJob,
    topic: string
  ): AppNotificationMessage {
    const notification = new AppNotificationMessage(
      this.machineScheduleDtoMapper.asDto(schedueledJob),
      topic,
      null /* TODO: here we should send the gym-id*/,
      null /* TODO: check if this is relevant */
    );
    return notification;
  }

  private getTopicByJobId(jobId: number) {
    if (jobId === Consts.CLEAN_MACHINE_JOB_ID) {
      return SocketTopics.TOPIC_CLEAN_MACHINE;
    }

    if (jobId === Consts.MACHINE_SERVICE_JOB_ID) {
      return SocketTopics.TOPIC_MACHINE_SERVICE;
    }

    throw new InputError(`Job id is not defined`);
  }
}