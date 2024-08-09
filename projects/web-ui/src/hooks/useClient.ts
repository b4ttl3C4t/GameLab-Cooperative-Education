import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { Stream } from "stream";
import { useDevice } from "./useDevice";
import stickers from "../components/Conference/stickers";

const configuration = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
    ],
    iceCandidatePoolSize: 10,
};

let socket = io(import.meta.env.VITE_ENDPOINT, {
    transports: ["websocket"]
});

interface Client {
    pc: RTCPeerConnection;
    username: string;
    myColor: string;
    connected: boolean;
    joined: boolean;
    roomId: string;
    setUsername: (string) => void;
    setRoomId: (string) => void;
    connect: () => Promise<Socket>;
    joinRoom: () => void;
    sendMessage: (message: string) => void;
    sendImage: (base64: string) => void;
    addStk: (name:string,base64: string) => void;
    sendAction: (message: string) => void;
    micOpened: ReturnType<typeof useDevice>["micOpened"];
    camOpened: ReturnType<typeof useDevice>["camOpened"];
    remoteMic: boolean;
    remoteCam: boolean;
    getRemoteCam: () => boolean;
    getRemoteMic: () => boolean;
    getSocket: () => Socket;

    // private:
    setCandidate: () => void;
    listenCandidate: () => Promise<void>;
    sendOffer: () => Promise<void>;
    listenOffer: () => Promise<void>;
    sendAnswer: () => Promise<void>;
    listenAnswer: () => Promise<void>;
}

export const useClient = create<Client>((set, get) => ({
    username: '',
    connected: false,
    joined: false,
    remoteMic: false,
    remoteCam: false,
    roomId: '',
    myColor: "hsl(0,0%,0%)",
    pc: new RTCPeerConnection(configuration),
    micOpened: useDevice.getState().micOpened,
    camOpened: useDevice.getState().camOpened,
    setUsername: (username: string) => {
        set({ username });
    },
    setRoomId: (roomId: string) => {
        set({ roomId });
    },
    getRemoteCam: () => {
        return get().remoteCam;
    },
    getRemoteMic: () => {
        return get().remoteMic;
    },
    getSocket: () => {
        return socket;
    },
    connect: async () => {
        await socket.connect();
        socket.once("connect", () => {
            socket.emit("ping");
        });
        socket.once("close", () => set({ connected: false }));
        socket.once("error", () => set({ connected: false }));
        return socket;
    },
    sendMessage: async (message: string) => {
        const { username, roomId,  myColor } = get();
        socket.emit("message", message, username, roomId, myColor);
    },
    sendImage: async (base64: string) => {
        const { username, roomId, myColor } = get();
        socket.emit("image", base64, username, roomId, myColor);
    },
    addStk: async (name: string, base64: string) => {
        const { roomId } = get();
        socket.emit("addStk", name, base64, roomId);
    },
    sendAction: async (message: string) => {
        socket.emit("action", message);
    },
    joinRoom: async () => {
        let { remoteMic, remoteCam, joined, username, roomId, myColor, setCandidate, sendOffer, listenCandidate, listenOffer, listenAnswer, micOpened, camOpened} = get();
        if (!joined) {
            console.log("join room", roomId, username, micOpened, camOpened);
            socket.emit("join room", roomId, username, micOpened, camOpened);
            micOpened ? socket.emit("action", "unmute") : socket.emit("action", "mute");
            camOpened ? socket.emit("action", "videoon") : socket.emit("action", "videooff");
            set({ myColor: `hsl(${Math.floor(Math.random() * 360)},${Math.floor(Math.random() * 50) + 50}%,${Math.floor(Math.random() * 60) + 20}%)` });
            set({ joined: true });

            socket.on("join room", (people, socketname, micSocket, videoSocket, stickers) => {
                console.log("Entered the room", people, socketname, micSocket, videoSocket)
                if (people) {
                    console.log(micSocket[people], videoSocket[people]);
                    const micOpen = micSocket[people] === "on";
                    const camOpen = micSocket[people] === "on";
                    remoteMic = micOpen; remoteCam = camOpen;
                    //set({ remoteMic: micOpen, remoteCam: camOpen }); /* BUG */
                    console.log(remoteMic, remoteCam);
                }
            });
            socket.on("newComing", hi => {
                setCandidate();
                sendOffer();
            })
            listenOffer();
            listenCandidate();
            listenAnswer();
        }
    },
    setCandidate: () => {
        let { pc, roomId } = get();
        console.log("Setting candidate...");
        pc.onicecandidate = (e) => {
            console.log("onicecandidate");
            let candidate = {
                type: "candidate",
                candidate: null,
                sdpMid: null,
                sdpMLineIndex: null
            };
            if (e.candidate) {
                candidate.candidate = e.candidate.candidate;
                candidate.sdpMid = e.candidate.sdpMid;
                candidate.sdpMLineIndex = e.candidate.sdpMLineIndex;
                socket.emit("new icecandidate", candidate, roomId);
                console.log("Sent candidate", candidate);
            }
        };
    },
    listenCandidate: async () => {
        let { pc } = get();
        socket.on("new icecandidate", (candidate, clientId) => {
            if (!pc) {
                console.error("no peerconnection");
                return;
            }
            if (!candidate) {
                console.log("Recieved NULL Candidate:", candidate, clientId);
                pc.addIceCandidate(null);
            } else {
                console.log("Recieved Candidate:", candidate, clientId);
                pc.addIceCandidate(candidate);
            }
        });
    },
    sendOffer: async () => {
        let { pc, roomId } = get();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("video-offer", { type: 'offer', sdp: offer.sdp }, roomId);
        console.log("Sent offer", offer, pc);
    },
    sendAnswer: async () => {
        let { pc, roomId } = get();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("video-answer", { type: 'answer', sdp: answer.sdp }, roomId);
        console.log("Sent answer");
    },
    listenOffer: async () => {
        let { pc, sendAnswer, setCandidate } = get();
        socket.on("video-offer", async (offer, clientId, socketname, micSocket, videoSocket) => {
            setCandidate();
            await pc.setRemoteDescription(offer);
            console.log("set Remote Description by offer", pc);
            sendAnswer();
            return;
        });
    },
    listenAnswer: async () => {
        let { pc } = get();
        socket.on("video-answer", async (answer, clientId) => {
            console.log("Recieved answer");
            if (!pc) {
                console.error("no peerconnection");
                return;
            }
            try {
                await pc.setRemoteDescription(answer);
                console.log("set Remote Description by answer", pc);
            } catch (e) {
                console.log(e);
            }
        })
    },
}));
