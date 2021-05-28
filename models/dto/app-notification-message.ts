export class AppNotificationMessage {
  id: string;
  content: any;
  topic: string;
  userId: string;
  username: string;
  time: Date;
  seen: boolean;
  targetUserIds: string[]; // TODO: check if this is relevant

  constructor(data: any, topic: string, userId?: string, username?: string) {
    this.content = data;
    this.userId = userId;
    this.username = username;
    this.topic = topic;
    this.targetUserIds = data.targetUserIds ? data.targetUserIds : null;
    this.time = new Date();
  }
}
