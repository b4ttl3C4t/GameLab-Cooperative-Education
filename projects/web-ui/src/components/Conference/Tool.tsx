import { css } from "@emotion/react";
import { useRef } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaPhoneSlash,
} from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useDevice } from "../../hooks/useDevice";

const styles = {
  utils: css`
    text-align: center;
    margin: 0 auto;
    display: flex;
    margin-top: 50px;
    width: 260px;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 10px;
    justify-content: center;
  `,
  audio: css`
    background-color: var(--nicegreen);
    text-align: center;
    color: white;
    padding: 10px;
    height: 40px;
    width: 40px;
    border-radius: 100px;
    transition: background-color 0.3s;

    &:hover {
      cursor: pointer;
      background-color: var(--black);
    }
  `,
  noVideo: css`
    background-color: var(--nicegreen);
    text-align: center;
    margin-left: 10px;
    color: white;
    padding: 10px;
    height: 40px;
    width: 40px;
    border-radius: 100px;
    transition: background-color 0.3s;

    &:hover {
      cursor: pointer;
      background-color: var(--black);
    }
  `,
  screenShare: css`
    background-color: #d8d8d8;
    text-align: center;
    margin-left: 10px;
    color: var(--black);
    padding: 10px;
    height: 40px;
    width: 40px;
    border-radius: 100px;
    transition: background-color 0.3s;
    transition: color 0.3s;

    &:hover {
      cursor: pointer;
      color: white;
      background-color: var(--black);
    }
  `,
  cutcall: css`
    background-color: #cc4e4e;
    text-align: center;
    margin-left: 10px;
    color: white;
    padding: 10px;
    height: 40px;
    width: 40px;
    border-radius: 100px;
    transition: background-color 0.3s;

    &:hover {
      cursor: pointer;
      background-color: var(--black);
    }
  `,
  copyCodeCont: css`
    position: absolute;
    top: 10px;
    left: 0;
    display: flex;
  `,
  roomCode: css`
    color: var(--nicegreen);
    padding: 10px 20px;
    background-color: white;
    border-bottom: 3px solid var(--nicegreen);
    font-weight: bold;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  `,
  copyCodeBtn: css`
    padding: 10px 0;
    width: 100px;
    text-align: center;
    color: white;
    background-color: var(--nicegreen);
    border: none;
    font-weight: bold;
    outline: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }
  `,
  tooltip: css`
    position: relative;
    display: inline-block;

    & .tooltiptext {
      visibility: hidden;
      width: 120px;
      background-color: rgb(15, 15, 15);
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      margin-left: -60px;
      opacity: 0;
      font-size: 14px;
      transition: opacity 0.3s;

      &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: rgb(15, 15, 15) transparent transparent transparent;
      }
    }

    &:hover .tooltiptext {
      visibility: visible;
      opacity: 0.8;
    }
  `,
  nodevice: css`
    background-color: #b12c2c !important;
  `,
};

interface ToolProps {
  leaveChat: () => void;
}

export const Tool: React.FC<ToolProps> = ({leaveChat}) => {
  const copyState = useRef<HTMLButtonElement>(null);
  const { toggleCam, toggleMic, camOpened, micOpened } = useDevice();
  const { id } = useParams();

  return (
    <footer css={{ position: "relative" }}>
      <div css={styles.utils}>
        <div
          css={[styles.audio, !micOpened && styles.nodevice, styles.tooltip]}
          onClick={toggleMic}
        >
          {micOpened ? <FaMicrophone /> : <FaMicrophoneSlash />}
          <span className="tooltiptext">Close Microphone</span>
        </div>
        <div
          css={[styles.noVideo, !camOpened && styles.nodevice, styles.tooltip]}
          onClick={toggleCam}
        >
          {camOpened ? <FaVideo /> : <FaVideoSlash />}
          <span className="tooltiptext">Close Camera</span>
        </div>
        <div css={[styles.screenShare, styles.tooltip]}>
          <FaDesktop />
          <span className="tooltiptext">Share Screen</span>
        </div>
        <div css={[styles.cutcall, styles.tooltip]} onClick={leaveChat}>
          <FaPhoneSlash />
          <span className="tooltiptext">Leave Call</span>
        </div>
      </div>
      <div css={styles.copyCodeCont}>
        <div css={styles.roomCode}>{id}</div>
        <button
          css={styles.copyCodeBtn}
          ref={copyState}
          onClick={() => {
            if (id && copyState.current) {
              navigator.clipboard.writeText(id);
              copyState.current.textContent = "Copied!!";
              setTimeout(
                () => (copyState.current!.textContent = "Copy Code"),
                5000
              );
            }
          }}
        >
          Copy Code
        </button>
      </div>
    </footer>
  );
};
