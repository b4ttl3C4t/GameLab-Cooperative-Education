import { css } from "@emotion/react";
import { FaCommentAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { io, type Socket } from "socket.io-client";
import { useClient } from "../../hooks/useClient";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import stickers from './stickers';

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

      .stk: {
        height: 60px;
        width: 60px;
        object- fit: cover;
      }
    }

    .content {
      margin-top: 5px;
      font-size: 0.9rem;
    }

    .stk: {
    height: 60px;
    width: 60px;
    object- fit: cover;
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
    height: 16vh;
    background-color: #ffffff;
    border-radius: 5px;
    border: 2px solid;
    border-color: #393e46;
    
    position: relative;
    top: -24vh;
    left: 0px;
    z-index: 1;
    overflow-y: scroll;
    ::-webkit-scrollbar {

      width: 7px;

    }

    ::-webkit-scrollbar-button {

      background: transparent;

      border-radius: 4px;

    }

    ::-webkit-scrollbar-track-piece {

      background: transparent;

    }

    ::-webkit-scrollbar-thumb {

      border-radius: 4px;

      background-color: rgba(0, 0, 0, 0.4);

      border: 1px solid slategrey;

    }

    ::-webkit-scrollbar-track {

      box-shadow: transparent;

    }
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
    stkOpn: css`
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
    stkBtn: css`
    height: 68px;
    padding: 4px 4px;
    border: none;
    background-color: white;
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
    stk: css`
    height: 60px;
    width: 60px;
    object-fit: cover;
  `,
};

interface MessageContent {
    text: string;
    src: string;
}
interface Message {
    id: number;
    content: MessageContent[];
    username: string;
    timestamp: string;
    color: string;
}

let nextMessageId = 0;

export const Side = () => {
    const textRef = useRef<HTMLInputElement>(null);
    let stkBoxRef = useRef<HTMLDivElement>(null);
    let [messages, setMessages] = useState<Message[]>([]);
    const { sendMessage, getSocket } = useClient();
    const socket = getSocket();

    const handleSendMessage = (msg, username, msgColor, date) => {
        if (msg === '') return;
        let d = new Date(date);
        let hr, min, sec, str_min: string, str_sec: string;
        hr = d.getHours(); min = d.getMinutes(); sec = d.getSeconds();
        if (min < 10)
            str_min = "0" + min;
        else
            str_min = min;
        if (sec < 10)
            str_sec = "0" + sec;
        else
            str_sec = sec;
        const time = `${hr}:${str_min}:${str_sec}`;
        console.log(username + ":", msg, time, nextMessageId);

        let words = msg.split(" ");
        let contents: MessageContent[] = [{ text: "", src: "" }];
        words.map((word: string) => {
            let isStk = false;
            let stkId;
            console.log("len:", contents.length);
            for (let i = 0; i < stickers.length; i++) {
                if (":" + stickers[i].image.slice(14, -4) + ":" === word) {
                    isStk = true;
                    stkId = i;
                    break
                }
            }
            if (isStk) {
                contents[contents.length - 1].text += " ";
                contents.push({ text: "", src: stickers[stkId].image });
            } else {
                contents[contents.length-1].text += " " + word;
            }
        })

        const newMessage = {
            id: nextMessageId++,
            content: contents,
            username: username,
            timestamp: time,
            color: msgColor,
        };

        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, newMessage];
            return updatedMessages;
        });
    }

    useEffect(() => {
        socket.on("message", handleSendMessage);
    }, []);

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
                {messages.map(msg => (
                    <div key={msg.id} css={styles.message}>
                        <div className="info">
                            <span className="username" style={{ color: msg.color }}>{msg.username}</span>
                            <span className="time">{msg.timestamp}</span>
                        </div>
                        <div>{msg.content.map(content => (
                            < >
                                {content.src !== "" && <img css={styles.stk} src={content.src} />}
                                {content.text !== "" && <s className="content" >{content.text}</s>}
                            </>
                        ))}</div>
                    </div>
                ))}
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
                    <button css={styles.stkOpn} onClick={() => {
                        stkBoxRef.current?.hidden ? stkBoxRef.current!.hidden = false : stkBoxRef.current!.hidden = true;
                    }}>😀</button>
                </div>
                <div css={{ width: "20%", marginLeft: 20 }}>
                    <button css={styles.sendBtn} onClick={() => {
                        if (textRef) {
                            sendMessage(textRef.current!.value);
                            textRef.current!.value = "";
                        }
                    }}>Send</button>
                </div>
            </div>
            <div ref={stkBoxRef} css={styles.stkBox} hidden>

                {stickers &&
                    stickers.map((r) => (
                        <button css={styles.stkBtn} onClick={() => {
                            if (!textRef.current!.value.endsWith(" ")) {
                                textRef.current!.value += " ";
                            }
                            textRef.current!.value += ":" + r.image.slice(14, -4) + ": ";
                        }}>
                            <div >
                                <img src={r.image} css={styles.stk} />
                            </div>
                        </button>
                    ))}
                {/*<img src={sticker0} css={styles.stk } />*/}

            </div>
        </>
    );
};
