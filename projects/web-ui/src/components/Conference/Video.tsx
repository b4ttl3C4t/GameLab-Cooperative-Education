import { css } from "@emotion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { useClient } from "../../hooks/useClient";
import { useDevice } from "../../hooks/useDevice";
import { useEffect, useRef } from "react";

const styles = {
  wrap: css`
    height: 75vh;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  `,
  box: css`
    background-color: #353b48;
    height: 25%;
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

type Video = {
  username: string;
  //videoElement : React.RefObject<HTMLVideoElement>;
  camActive : boolean;
  micActive : boolean;
};

interface VideoProps {
  videos: Video[];
}

export const Video: React.FC<VideoProps> = ({videos}) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const { username } = useClient();
  const { requestDevice, allowed, micOpened, camOpened } =
    useDevice();

  const camActive = allowed.cam && camOpened;
  const micActive = allowed.mic && micOpened;
  useEffect(() => {
    if (videoElement.current) {
      requestDevice().then((stream) => {
        videoElement.current!.srcObject = stream;
        if (!camActive) stream.getVideoTracks()[0].enabled = camActive;
        if (!micActive) stream.getAudioTracks()[0].stop();
      });
    }
  }, [requestDevice, camActive, micActive]);

  return (
    <div css={styles.wrap} id="vcont">
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
        {videos.map((video, index) => (
          video.username !== username && (
          <div key={index} css={styles.box}>
            <video
              css={styles.frame}
              ref={videoElement}
              autoPlay
              playsInline
            ></video>
            <div css={styles.nameTag}>{video.username}</div>
            <div css={styles.mute}>
              {video.micActive ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </div>
            {!video.camActive && <div css={styles.videoOff}>
              Video Off
            </div>}
          </div>
        )))}
    </div>
  );
};
