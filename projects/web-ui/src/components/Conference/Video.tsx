import { css } from "@emotion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { useClient } from "../../hooks/useClient";
import { useDevice } from "../../hooks/useDevice";
import { useEffect, useRef } from "react";

const styles = {
    wrap: css`
    height: 75vh;
  `,
    box: css`
    background-color: #353b48;
    height: 100%;
    min-height: 200px;
    width: 100%;
    border-radius: 5px;
    position: relative;
  `,
    frame: css`
    background-color: #353b48;
    height: 100%;
    min-height: 200px;
    width: 50%;
    object-fit: cover;
    border-radius: 5px;
  `,
    nameTag: css`
    color: white;
    bottom: 10px;
    position: absolute;
    left: 10px;
    bottom: 10px;
  `,
    mute: css`
    color: rgb(214, 52, 52);
    bottom: 10px;
    position: absolute;
    right: 10px;
    font-size: 20px;
    bottom: 10px;
  `,
    videoOff: css`
    color: white;
    bottom: 10px;
    font-weight: bold;
    position: absolute;
    top: 40%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  `,
};
let added = false;

export const Video = () => {
    const videoElement = useRef<HTMLVideoElement>(null);
    const videoElement2 = useRef<HTMLVideoElement>(null);
    const { username, pc, getRemoteCam, getRemoteMic, sendAction, getSocket} = useClient();
    let remoteStream;
    let { requestDevice, allowed, micOpened, camOpened, localStream} = useDevice();
    const socket = getSocket();
    const camActive = allowed.cam && camOpened;
    const micActive = allowed.mic && micOpened;

    useEffect(() => {
        if (videoElement.current) {
            requestDevice().then((stream) => {
                localStream = stream;
                if (!added) {
                    localStream.getTracks().forEach((track) => {
                        track.enabled = true;
                        pc.addTrack(track, localStream);
                        console.log("Added track", track, pc);
                    });
                    added = true;
                } else {
                    localStream.getVideoTracks()[0].enabled = camOpened;
                    localStream.getAudioTracks()[0].enabled = micOpened;
                }
                videoElement.current!.srcObject = localStream;
            });
        }
        if (videoElement2.current) {
            pc.ontrack = (e) => (
                console.log("gets remote streams."),
                remoteStream = e.streams[0],
                console.log("remote situation:", getRemoteCam(), getRemoteMic()),
                remoteStream.getVideoTracks().forEach((track) => {
                    track.enabled = getRemoteCam();
                }),
                remoteStream.getAudioTracks().forEach((track) => {
                    track.enabled = getRemoteMic();
                }),
                videoElement2.current!.srcObject = remoteStream,
                socket.on("action", (msg, clientId) => {
                    console.log("Recieved action:", msg);
                    switch (msg) {
                        case "mute":
                            remoteStream.getAudioTracks().forEach((track) => {
                                track.enabled = false;
                            });
                            break;
                        case "unmute":
                            remoteStream.getAudioTracks().forEach((track) => {
                                track.enabled = true;
                            });
                            break;
                        case "videoon":
                            remoteStream.getVideoTracks().forEach((track) => {
                                track.enabled = true;
                            });
                            break;
                        case "videooff":
                            remoteStream.getVideoTracks().forEach((track) => {
                                track.enabled = false;
                            });
                            break;
                    }
                    videoElement2.current!.srcObject = remoteStream
                })
            );

}
        micActive ? sendAction("unmute") : sendAction("mute");
        camActive ? sendAction("videoon") : sendAction("videooff");
    }, [requestDevice, camActive, micActive, added]);

return (
    <div css={styles.wrap} id="vcont">
        <div css={styles.box}>
            <video
                css={styles.frame}
                ref={videoElement}
                autoPlay
                playsInline
                muted
            ></video>
            <video
                css={styles.frame}
                ref={videoElement2}
                autoPlay
                playsInline
            ></video>
            <div css={styles.nameTag}>{username} (You)</div>
            <div css={styles.mute}>
                {micActive ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </div>
            {!camActive && <div css={styles.videoOff}>
                Video Off
            </div>}
        </div>
    </div>
);
};
