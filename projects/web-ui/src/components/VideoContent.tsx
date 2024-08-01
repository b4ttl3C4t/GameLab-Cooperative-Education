import { css } from "@emotion/react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa6";
import { useDevice } from "../hooks/useDevice";
import { useEffect, useRef } from "react";

const styles = {
  videoCont: css`
    width: 100%;
    text-align: center;
    @media screen and (max-width: 1200px) {
      border: 1px solid red;
      margin-top: 100px;
      margin-bottom: 100px;
    }
  `,
  videoSelf: css`
    height: 400px;
    width: 100%;
    background-color: #393e46;
    border-radius: 10px;
    object-fit: cover;
  `,
  settings: css`
    margin: 0 auto;
    display: flex;
    margin-top: 10px;
    width: 100px;
  `,
  device: css`
    background-color: #4ecca3;
    border-radius: 100px;
    padding: 10px;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    color: white;

    &:hover {
      background-color: #393e46;
      cursor: pointer;
    }
  `,
  nodevice: css`
    background-color: #b12c2c !important;
  `,
};

const VideoContent = () => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const { requestDevice, micOpened, camOpened, toggleMic, toggleCam } =
    useDevice();


  useEffect(() => {
    if (videoElement.current) {
      requestDevice().then((stream) => {
        videoElement.current!.srcObject = stream;
        if (!camOpened) stream.getVideoTracks()[0].enabled = camOpened;
        if (!micOpened) stream.getAudioTracks()[0].stop();
      });
    }
  }, [requestDevice, micOpened, camOpened]);

  return (
    <div css={styles.videoCont}>
      <video
        ref={videoElement}
        css={styles.videoSelf}
        autoPlay
        muted
        playsInline
      />
      <div css={styles.settings}>
        <div
          css={[styles.device, !micOpened && styles.nodevice]}
          onClick={toggleMic}
        >
          {micOpened ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </div>
        <div
          css={[styles.device, !camOpened && styles.nodevice]}
          onClick={toggleCam}
        >
          {camOpened ? <FaVideo /> : <FaVideoSlash />}
        </div>
      </div>
    </div>
  );
};

export default VideoContent;
