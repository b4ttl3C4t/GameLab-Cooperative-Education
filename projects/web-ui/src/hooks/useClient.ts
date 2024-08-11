import { create } from "zustand";
import {type Socket } from "socket.io-client";
import socketService from "./socketService";
interface Client {
  username: string;
  connected: boolean;
  meetCode: string;
  setUsername: (string) => void;
  connect: (url: string) => Promise<Socket>;
  setMeetCode: (string) => void;
}

export const useClient = create<Client>((set) => ({
  username: "",
  connected: false,
  meetCode: "",
  setUsername: (username: string) => set({ username }),
  connect: async (url: string) => {
    const socket = socketService.connect(url);
    set({ connected: socketService.isConnected() });
    return socket;
  },
  setMeetCode: (meetCode: string) => set({ meetCode }),
}));
