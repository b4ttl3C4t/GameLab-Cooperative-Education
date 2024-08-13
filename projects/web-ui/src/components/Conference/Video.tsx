import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { useClient } from "../../hooks/useClient";

const styles = {
  container: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 10px;
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
    width: 100%;
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

export const LocalStream = () => {
  const { localStream, username } = useClient();
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div css={styles.box}>
      <video
        css={styles.frame}
        ref={videoElement}
        autoPlay
        playsInline
      ></video>
      <div css={styles.nameTag}>{username}</div>
    </div>
  );
}

export const RemoteStream = () => {
  const { remoteStream, username } = useClient();
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div css={styles.box}>
      <video
        css={styles.frame}
        ref={videoElement}
        autoPlay
        playsInline
      ></video>
      <div css={styles.nameTag}>{username}</div>
    </div>
  );
}

export const Video = ({ videoElement, username, micActive, camActive }) => {
  return (
    <div css={styles.box}>
      <video
        css={styles.frame}
        ref={videoElement}
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
  );
};

export const VideoGrid = () => {
  return (
    <div css={styles.container}>
      <LocalStream />
      <RemoteStream />
    </div>
  );
};