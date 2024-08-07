import React, { useState, KeyboardEvent } from 'react';
import { css } from "@emotion/react";
import { FaCommentAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

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
};

type Message = {
  username: string;
  time: string;
  content: string;
};

interface SideProps {
  messages: Message[];
  handleSend: (content: string) => void;
}

export const Side: React.FC<SideProps> = ({ messages, handleSend }) => {
  const [inputValue, setInputValue] = useState<string>('');
  
  const onSend = () => {
    if (inputValue.trim() === "") return;
    handleSend(inputValue);
    setInputValue(''); // 清空輸入框
  };

  // 按下enter鍵後能傳送訊息
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 防止在多行輸入框中創建新行
      onSend();
    }
  };

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
      <div css={styles.chatBox}>
        {messages.map((message, index) => (
          <div key={index} css={styles.message}>
            <div className="info">
              <span className="username">{message.username}</span>
              <span className="time">{message.time}</span>
            </div>
            <div className="content">{message.content}</div>
          </div>
        ))}
      </div>
      <div css={styles.chatInput}>
        <div css={{ width: "80%" }}>
          <input
            type="text"
            css={styles.inputBox}
            placeholder="Type chat here.."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div css={{ width: "20%", marginLeft: 20 }}>
          <button css={styles.sendBtn} onClick={onSend}>Send</button>
        </div>
      </div>
    </>
  );
};