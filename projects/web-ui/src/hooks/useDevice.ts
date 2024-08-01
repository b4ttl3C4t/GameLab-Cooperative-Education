import { create } from "zustand";

interface DeviceState {
  allowed: {
    mic: boolean;
    cam: boolean;
  };
  micOpened: boolean;
  camOpened: boolean;
  toggleMic: () => void;
  toggleCam: () => void;
  requestDevice: () => Promise<MediaStream>;
}

export const useDevice = create<DeviceState>((set) => ({
  allowed: {
    mic: false,
    cam: false,
  },
  micOpened: false,
  camOpened: false,
  toggleMic: () => set((state) => ({ micOpened: !state.micOpened && state.allowed.mic })),
  toggleCam: () => set((state) => ({ camOpened: !state.camOpened && state.allowed.cam })),
  requestDevice: async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const [cam, mic] = await Promise.all([
      navigator.permissions.query({ name: "camera" as never }),
      navigator.permissions.query({ name: "microphone" as never }),
    ]);
    set(() => ({
      allowed: { mic: mic.state === "granted", cam: cam.state === "granted" },
    }));

    return localStream;
  },
}));
