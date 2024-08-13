import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useDevice } from "./useDevice";
import { SocketType } from "dgram";

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ]
};

interface Client {
  username: string;
  roomId: string;
  connected: boolean;
  socket: Socket;
  peerConnection: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream: MediaStream;
  offerJSON: string;
  answerJSON: string;
  setUsername: (string) => void;
  setRoomId: (string) => void;
  getRoomId: () => string;
  getSocket: () => Socket;
  createPeerConnection: (type: string) => void;
  connect: (url: string) => Promise<Socket>;
}

export const useClient = create<Client>((set, get) => ({
  username: "",
  roomId: "",
  connected: false,
  socket: io(import.meta.env.VITE_ENDPOINT),
  peerConnection: new RTCPeerConnection(servers),
  localStream: new MediaStream(),
  remoteStream: new MediaStream(),
  offerJSON: "",
  answerJSON: "",

  setUsername: (username: string) => set({ username }),
  setRoomId: (roomId: string) => set({ roomId }),
  getRoomId: () => { return get().roomId },
  getSocket: () => { return get().socket },
  createPeerConnection: (type: string) => {
    let { localStream, peerConnection, remoteStream, offerJSON, answerJSON } = get();

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = async (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        type === "offer-sdp" ? offerJSON = JSON.stringify(event.candidate) : answerJSON = JSON.stringify(event.candidate);
      }
    }

    console.log("Peer connection created", peerConnection);
  },
  connect: async (url: string) => {
    const socket = io(url, {
      transports: ["websocket"]
    });

    get().socket = socket

    socket.once("connect", async () => {      
      get().localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      get().connected = true;

      const { username, roomId } = get();
      socket.emit("join room", roomId, username, useDevice.getState().micOpened, useDevice.getState().camOpened);
    });

    socket.on("createOffer", async () => {
      let { createPeerConnection, localStream, peerConnection, offerJSON } = get();

      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      createPeerConnection("offer-sdp");

      let offer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(offer);
      
      set({ offerJSON: JSON.stringify(offer) });
      offerJSON = JSON.stringify(offer);
      console.log("create offer completed");
    });
    
    socket.on("giveOffer", async (bid: string) => {
      console.log("give offer started");
      socket.emit("giveAnswer", get().offerJSON, bid, socket.id);
    });

    socket.on("createAnswer", async (givenOfferJSON: string, bid: string) => {
      let { createPeerConnection, peerConnection, localStream, offerJSON, answerJSON } = get();

      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      createPeerConnection("answer-sdp");

      offerJSON = givenOfferJSON;
      await peerConnection.setRemoteDescription(JSON.parse(offerJSON));

      let answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      set({ answerJSON: JSON.stringify(answer) });
      answerJSON = JSON.stringify(answer);
      socket.emit("returnAnswer", answerJSON, bid);

      console.log("everything is done");
      console.log("offerJSON", get().offerJSON);
      console.log("localStream", localStream);
      console.log("remoteStream", get().remoteStream);
    });

    socket.on("setAnswer", async (givenAnswerJSON: string) => {
      let { peerConnection, answerJSON } = get();

      answerJSON = givenAnswerJSON;
      await peerConnection.setRemoteDescription(JSON.parse(answerJSON));

      console.log("remote set answer completed");
      console.log("everything is done");
      console.log("answerJSON", get().answerJSON);
      console.log("localStream", get().localStream);
      console.log("remoteStream", get().remoteStream);
    });

    socket.once("close", () => set({ connected: false }));
    socket.once("error", () => set({ connected: false }));
    return socket;
  },
}));
