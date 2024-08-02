import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { ClientRequest, get } from "http";

interface Client {
  username: string;
  roomId: string;
  connected: boolean;
  setUsername: (string) => void;
  setRoomId: (string) => void;
  connect: (url: string) => Promise<Socket>;
}

export const useClient = create<Client>((set, get) => ({
  username: "",
  roomId: "",
  connected: false,

  setUsername: (username: string) => set({ username }),
  setRoomId: (roomId: string) => set({ roomId }),
  connect: async (url: string) => {
    const socket = io(url, {
      transports: ["websocket"]
    });

    socket.once("connect", () => { 
      set({ connected: true })

      const { username, roomId } = get();
      socket.emit("join room", { username: username, room: roomId });
    });
    socket.once("close", () => set({ connected: false }));
    socket.once("error", () => set({ connected: false }));
    return socket;
  },
}));
