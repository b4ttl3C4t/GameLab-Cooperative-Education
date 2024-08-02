import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
interface Client {
  username: string;
  connected: boolean;
  setUsername: (string) => void;
  connect: (url: string) => Promise<Socket>;
}

export const useClient = create<Client>((set) => ({
  username: "",
  connected: false,
  setUsername: (username: string) => set({ username }),
  connect: async (url: string) => {
    const socket = io(url, {
      transports: ["websocket"]
    });
    socket.once("connect", () => {
      socket.emit("ping", "&&&&&")
    });
    socket.once("close", () => set({ connected: false }));
    socket.once("error", () => set({ connected: false }));
    return socket;
  },
}));
