import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface Client {
  username: string;
  roomId: string;
  connected: boolean;
  socket: Socket;
  setUsername: (string) => void;
  setRoomId: (string) => void;
  getRoomId: () => string;
  getSocket: () => Socket;
  connect: (url: string) => Promise<Socket>;
}

export const useClient = create<Client>((set, get) => ({
  username: "",
  roomId: "",
  connected: false,
  socket: io(import.meta.env.VITE_ENDPOINT),

  setUsername: (username: string) => set({ username }),
  setRoomId: (roomId: string) => set({ roomId }),
  getRoomId: () => { return get().roomId },
  getSocket: () => { return get().socket },
  connect: async (url: string) => {
    const socket = io(url, {
      transports: ["websocket"]
    });

    set({ socket: socket });

    socket.once("connect", () => { 
      set({ connected: true })

      const { username, roomId } = get();
      socket.emit("join room", roomId, username);
    });

    socket.once("close", () => set({ connected: false }));
    socket.once("error", () => set({ connected: false }));
    return socket;
  },
}));
