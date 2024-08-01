import { create } from "zustand";
//import { useClient } from "./useClient";

interface DeviceState {
    allowed: {
        mic: boolean;
        cam: boolean;
    };
    micOpened: boolean;
    camOpened: boolean;
    toggleMic: () => void;
    toggleCam: () => void;
    localStream: MediaStream;
    requestDevice: () => Promise<MediaStream>;
    //sendAction: ReturnType<typeof useClient>["sendAction"];
}

export const useDevice = create<DeviceState>((set, get) => ({
    //sendAction: useClient.getState().sendAction,
    allowed: {
        mic: false,
        cam: false,
    },
    micOpened: false,
    camOpened: false,
    localStream: new MediaStream,
    toggleMic: () => {
        set((state) => ({ micOpened: !state.micOpened && state.allowed.mic }));
        //let { allowed, micOpened, sendAction} = get();
        //if (allowed.mic) {
        //    if (micOpened) {
        //        sendAction("unmute");
        //    } else {
        //        sendAction("mute");
        //    }
        //}

        //localStream.getAudioTracks().forEach((track) => {
        //    track.enabled = micOpened && allowed.mic;
        //})
    },
    toggleCam: () => {
        set((state) => ({ camOpened: !state.camOpened && state.allowed.cam }));
        //let { allowed, camOpened, sendAction} = get();
        //if (allowed.cam) {
        //    if (camOpened) {
        //        sendAction("videoon");
        //    } else {
        //        sendAction("videooff");
        //    }
        //}

        //localStream.getVideoTracks().forEach((track) => {
        //    track.enabled = camOpened && allowed.cam;
        //})
    },
    requestDevice: async () => {
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const [cam, mic] = await Promise.all([
            navigator.permissions.query({ name: "camera" as never }),
            navigator.permissions.query({ name: "microphone" as never }),
        ]);
        set(() => ({
            allowed: { mic: mic.state === "granted", cam: cam.state === "granted" },
        }));
        set({ localStream: stream })
        return stream;
    },
}));
