import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;

  connect(url: string): Socket {
    if (!this.socket) {
      this.socket = io(url, {
        transports: ["websocket"]
      });
      this.socket.on("connect", () => {
        this.connected = true;
        this.socket?.emit("ping");
      });
      this.socket.on("close", () => this.connected = false);
      this.socket.on("error", () => this.connected = false);
    }
    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

const socketService = new SocketService();
export default socketService;
