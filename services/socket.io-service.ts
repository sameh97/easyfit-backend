import { injectable } from "inversify";
import * as Server from "socket.io";

@injectable()
export class WebSocketService {
  public socketIO: Server.Socket;

  constructor() {}

  public connect = async (server): Promise<void> => {
    this.socketIO = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });

    this.socketIO.on("connection", (socket) => {
      //TODO: change this event handling:
      this.socketIO.emit(
        "event",
        `you have connected successfully to the server`
      );
      console.log("a user connected " + socket.id);
    });
  };
}
