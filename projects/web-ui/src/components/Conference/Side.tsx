import { css } from "@emotion/react";
import { FaCommentAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { io, type Socket } from "socket.io-client";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useClient } from "../../hooks/useClient";
import { usePopUp } from "../../hooks/usePopUp";
import stickers from '../../hooks/stickers';

const img_max_px = 540;

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
    msgImg: css`
    max-height: 270px;
    width: 270px;
    object-fit: scale-down
  `,
    imgInput: css`
    height: 36px;
    padding: 10px 10px;
    border: none;
    background-color: white;
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
    addStk: css`
    height: 60px;
    width: 60px;
    padding: 0px 0px;
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
};

interface MessageContent {
    text: string;
    stk: string;
    img: string;
}
interface Message {
    id: number;
    content: MessageContent[];
    username: string;
    timestamp: string;
    color: string;
}
interface cstStk {
    name: string;
    base64: string;
}

let nextMessageId = 0;

export const Side = () => {
    const { getSocket, sendMessage, sendImage, addStk } = useClient();
    const { setErrorMessage } = usePopUp();
    const textRef = useRef<HTMLInputElement>(null);
    let stkBoxRef = useRef<HTMLDivElement>(null);
    let [messages, setMessages] = useState<Message[]>([]);
    let [myStks, setStks] = useState<cstStk[]>([]);
    const socket = getSocket();

    const handleSendMessage = (msg, username, msgColor, date, type = "text") => {
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

        if (type === "text") {
            let words = msg.split(" ");
            let contents: MessageContent[] = [{ text: "", stk: "", img: "" }];
            words.map((word: string) => {
                let isStk = false;
                let isCstStk = false;
                for (let i = 0; i < stickers.length; i++) {
                    if (":" + stickers[i].image.split('/')[3].split('.')[0] + ":" === word) {
                        contents[contents.length - 1].text += " ";
                        contents.push({ text: "", stk: stickers[i].image, img: "" });
                        isStk = true;
                        break
                    }
                }
                if (!isStk) {
                    setStks(Stks => {
                        for (let i = 0; i < Stks.length; i++) {
                            if (":" + Stks[i].name + ":" === word) {
                                contents[contents.length - 1].text += " ";
                                contents.push({ text: "", stk: Stks[i].base64, img: "" });
                                isCstStk = true;
                                break
                            }
                        }
                        if (!isCstStk) {
                            contents[contents.length - 1].text += " " + word;
                        }
                        return Stks;
                    });
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

        } else if (type === "image") {
            let contents: MessageContent[] = [{ text: "", stk: "", img: msg }];

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
    }
    const uploadImg = (event, type = "img") => {
        const file = event.target.files![0];
        const fileName:string = event.target.files![0].name;
        const reader = new FileReader();
        reader.onload = function (e) {
            const result = e.target.result.toString();
            if (result.split(";")[0].split("/")[0] === "data:image") {
                let theCanva: HTMLImageElement = document.getElementById('theCanva');
                theCanva.src = e.target.result.toString();
                theCanva.onload = (e1) => {
                    if (result.split(";")[0].split("/")[1] !== "gif") {
                        let canvas: HTMLCanvasElement = document.getElementById('canvas');
                        let compressionRatio = Math.max(theCanva.naturalHeight / img_max_px, theCanva.naturalWidth / img_max_px);
                        if (compressionRatio < 1) compressionRatio = 1;
                        const drawer = canvas.getContext("2d");
                        canvas.width = theCanva.naturalWidth / compressionRatio;
                        canvas.height = theCanva.naturalHeight / compressionRatio;
                        drawer.drawImage(theCanva, 0, 0, theCanva.naturalWidth / compressionRatio, theCanva.naturalHeight / compressionRatio);
                        if (type === "img") {
                            sendImage(canvas.toDataURL());
                        } else if (type === "stk") {
                            if (fileName.split('.').length > 2 || fileName.split(' ').length > 1) {
                                setErrorMessage("錯誤：請避免空格、冒號、以及句點在檔名中");
                            } else {
                                addStk(fileName, canvas.toDataURL());
                            }
                        }
                        //canvas.clearRect();
                    } else if (result.length < 2000000) {
                        if (type === "img") {
                            sendImage(result);
                        } else if (type === "stk") {
                            if (fileName.split('.').length > 2 || fileName.split(' ').length > 1) {
                                setErrorMessage("錯誤：請避免空格、冒號、以及句點在檔名中");
                            } else {
                                addStk(fileName, result);
                            }
                        }
                    } else {
                        setErrorMessage("錯誤：gif過大，限制約為1.5MB以內");
                    }
                }
            } else {
                setErrorMessage("並非並非並非圖片");
            }
        };
        reader.readAsDataURL(file);

    };

    useEffect(() => {
        socket.on("message", handleSendMessage);
        socket.on("image", (msg, username, msgColor, date) => {
            handleSendMessage(msg, username, msgColor, date, "image");
        });
        socket.on("newStk", (name, base64) => {
            const newStks = { name: name, base64: base64 };
            setStks(prevStks => {
                const updatedStks = [...prevStks, newStks];
                return updatedStks;
            });
        })
    }, []);

    return (
        <>
            <img id="theCanva" src="" hidden />
            <canvas id="canvas" width="540px" height="540px" hidden></canvas>
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
                                {content.stk !== "" && <img css={styles.stk} src={content.stk} />}
                                {content.text !== "" && <s className="content" >{content.text}</s>}
                                {content.img !== "" && <img css={styles.msgImg} src={content.img} />}
                            </>
                        ))}</div>
                    </div>
                ))}
            </div>
            <div css={styles.chatInput}>
                <div css={{ width: "60%" }}>
                    <input
                        type="text"
                        css={styles.inputBox}
                        placeholder="Type chat here.."
                        ref={textRef}
                    />
                </div>
                <label css={styles.imgInput} htmlFor="imgInput"><img src="/img/button/imgInput.png" css={{ height: "20px" }} /></label>
                <input css={{ display: "none" }} type="file" id="imgInput" accept="image/*" onChange={(event) => {
                    uploadImg(event);
                    event.target.value = "";
                }} />
                <div css={{ marginLeft: 5, marginRight: 5 }}>
                    <button css={styles.stkOpn} onClick={() => {
                        stkBoxRef.current?.hidden ? stkBoxRef.current!.hidden = false : stkBoxRef.current!.hidden = true;
                    }}>😀</button>
                </div>

                <div css={{ marginLeft: 5 }}>
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
                    stickers.map((i) => (
                        <button css={styles.stkBtn} onClick={() => {
                            if (!textRef.current!.value.endsWith(" ")) {
                                textRef.current!.value += " ";
                            }
                            textRef.current!.value += ":" + i.image.split('/')[3].split('.')[0] + ": ";
                        }}>
                            <div >
                                <img src={i.image} css={styles.stk} />
                            </div>
                        </button>
                    ))}
                {myStks &&
                    myStks.map((i) => (
                        <button css={styles.stkBtn} onClick={() => {
                            if (!textRef.current!.value.endsWith(" ")) {
                                textRef.current!.value += " ";
                            }
                            textRef.current!.value += ":" + i.name + ": ";
                        }}>
                            <div >
                                <img src={i.base64} css={styles.stk} />
                            </div>
                        </button>
                    ))}
                <button css={styles.stkBtn} >
                    <label css={styles.addStk} htmlFor="addStk"><img src="/img/button/addStk.png" css={styles.stk} /></label>
                    <input css={{ display: "none" }} type="file" id="addStk" accept="image/*" onChange={(event) => {
                        uploadImg(event, "stk");
                        event.target.value = "";
                    }} />
                </button>
            </div>
        </>
    );
};
