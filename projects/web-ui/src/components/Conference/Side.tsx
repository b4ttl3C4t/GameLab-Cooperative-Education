import { css } from "@emotion/react";
import { FaCommentAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { io, type Socket } from "socket.io-client";
import { useClient } from "../../hooks/useClient";
import { useRef } from "react";

const styles = {
    tab: css`
    font-weight: bold;
    color: var(--black);
    background-color: #ffffff;
    width: 100%;
    display: flex;
    border-bottom: 2px solid var(--black);

    & > .chats,
    & > .attendies {
      padding: 10px;
      padding-top: 20px;
      width: 100%;
      text-align: center;
      transition: background-color 0.5s;

      &:hover {
        background-color: #f8f8f8;
        cursor: pointer;
      }
    }
  `,
    chatBox: css`
    background-color: #ffffff;
    height: 84vh;
    padding: 10px;
    padding-top: 10px;
    overflow-y: scroll;
  `,
    message: css`
    margin-bottom: 15px;
    margin-left: 10px;
    background-color: #ffffff;
    border-radius: 2px;
    word-break: break-all;
    word-wrap: break-word;

    .info {
      display: flex;
      font-size: 0.85rem;

      .username {
        font-weight: bold;
        color: var(--nicegreen);
      }

      .time {
        margin-left: 12px;
      }
    }

    .content {
      margin-top: 5px;
      font-size: 0.9rem;
    }
  `,
    chatInput: css`
    padding: 12px;
    display: flex;
    height: 60px;
    background-color: #ffffff;
    box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.15);
  `,
    inputBox: css`
    width: 100%;
    height: 36px;
    font-size: 0.85rem;
    padding: 4px 10px;
    border: none;
    border-bottom: 3px solid var(--nicegreen);
    color: var(--black);

    &:focus {
      outline: none;
    }
  `,
    stkBox: css`
    margin-bottom: 15px;
    margin-left: 10px;
    margin-right: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    border: 2px solid;

    border-color: #393e46;

    position: relative;
    top: -150px;
    left: 0px;
    z-index: 1;
  `,
    sendBtn: css`
    height: 36px;
    padding: 5px 20px;
    border: none;
    background-color: white;
    color: var(--nicegreen);
    font-weight: bold;
    font-size: 0.85rem;
    border-radius: 2px;
    transition: background-color 0.5s;

    &:hover {
      color: var(--blue);
      cursor: pointer;
      background-color: rgb(243, 243, 243);
    }

    &:focus {
      outline: none;
    }
  `,
    stkBtn: css`
    height: 36px;
    padding: 5px 10px;
    border: none;
    background-color: white;
    color: var(--nicegreen);
    font-weight: bold;
    font-size: 0.85rem;
    border-radius: 2px;
    transition: background-color 0.5s;

    &:hover {
      cursor: pointer;
      background-color: rgb(243, 243, 243);
    }

    &:focus {
      outline: none;
    }
  `,
};

export const Side = () => {
    const { sendMessage, roomId, getSocket, myColor } = useClient();
    const textRef = useRef<HTMLInputElement>(null);
    let msgRef = useRef<HTMLDivElement>(null);
    let stkBoxRef = useRef<HTMLDivElement>(null);
    let date_last = 0;
    function listen() {
        let socket = getSocket();
        socket.on("message", (msg, username, msgColor, date) => {
            console.log("delta date:", date - date_last);
            if (date - date_last > 1 && myColor != "hsl(0,0%,0%)") {
                console.log(username + ":", msg, date);
                let sec = date % (1000 * 60 * 60 * 24) / 1000;
                let hr = Math.floor(sec / 3600 + 8);
                if (hr > 24) hr -= 24;
                let min = Math.floor(sec % 3600 / 60);
                let str_min;
                if (min == 0) str_min = "00";
                else if (min < 10) str_min = "0" + min;
                else str_min = min;
                msgRef.current!.innerHTML +=
                    `<p>
                    <div className="info">
                    <span style="font-size:16px;">
                        <span style="font-weight:bold;"><span style="color:${msgColor}">${username}</span><span style="font-size:4px;"> </span>:</span>
                        <span style="color:#050505;">${msg}</span>
                    </span>
                    <span style="color:#777777;font-size:11px;">
                        ${hr}:${str_min}\n
                    </span >
                    </div>
                </p>`;
                date_last = date;
            }
        })
    }
    listen();
    return (
        <>
            <div css={styles.tab}>
                <div className="chats">
                    <FaCommentAlt />
                    Chats
                </div>
                <div className="attendies">
                    <FaUser />
                    Attendies
                </div>
            </div>
            <div css={styles.chatBox} >
                <div ref={msgRef} css={styles.message} />
            </div>
            <div css={styles.chatInput}>
                <div css={{ width: "70%" }}>
                    <input
                        type="text"
                        css={styles.inputBox}
                        placeholder="Type chat here.."
                        ref={textRef}
                    />
                </div>
                <div css={{ width: "10%", marginLeft: 5 }}>
                    <button css={styles.stkBtn} onClick={() => {
                        stkBoxRef.current?.hidden ? stkBoxRef.current!.hidden = false : stkBoxRef.current!.hidden = true;
                    }}>😀</button>
                </div>
                <div css={{ width: "20%", marginLeft: 20 }}>
                    <button css={styles.sendBtn} onClick={() => {
                        if (textRef) {
                            console.log(roomId);
                            sendMessage(textRef.current!.value);
                        }
                    }}>Send</button>
                </div>
            </div>
            <div ref={stkBoxRef} css={styles.stkBox} >
                <button css={styles.stkBtn} onClick={() => {
                    styles.chatBox = css`height: 8vh;`;
                }}>😀</button>
            </div>
        </>
    );
};
