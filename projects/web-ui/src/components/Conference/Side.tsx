import { css } from "@emotion/react";
import { FaCommentAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useClient } from "../../hooks/useClient";
import { useState, useEffect } from "react";

interface Message {
  id: number;
  content: string;
  username: string;
  timestamp: string;
}

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
  attendeesBox: css`
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
  attendee: css`
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

let nextMessageId = 0;

export const Side = () => {
  const [message, setMessage] = useState(''); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [attendees, setAttendees] = useState<string[]>([]);
  const { username, getRoomId, getSocket } = useClient();
  const socket = getSocket();

  useEffect(() => {
    const handleMessage = (msg, username, timestamp) => {
      const newMessage = {
        id: nextMessageId++,
        content: msg,
        username: username,
        timestamp: new Date(timestamp).toLocaleTimeString(),
      };
    
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const handleAttendees = (attendees: string[]) => {
      setAttendees(attendees);
    }
    
    socket.on("message", handleMessage);
    socket.on("attendees", handleAttendees);
  
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (message === '') return;
    
    socket.emit("message", message, username, getRoomId());
    setMessage('');
  }

  return (
    <>
      <div css={styles.tab}>
        <div className="chats">
          <FaCommentAlt />
          Chats
        </div>
        <div className="attendees">
          <FaUser />
          attendees
        </div>
      </div>
      <div css={styles.attendeesBox}>
        {attendees.map((attendees) => (
          <div key={attendees} css={styles.attendee}>
            <div className="info">
              <span className="username">{attendees}</span>
            </div>
          </div>
        ))}
      </div>
      {/* This is the chat box 
      <div css={styles.chatBox}>
        {messages.map(msg => (
          <div key={msg.id} css={styles.message}>
            <div className="info">
              <span className="username">{msg.username}</span>
              <span className="time">{msg.timestamp}</span>
            </div>
            <div className="content">{msg.content}</div>
          </div>
        ))}
      </div>
      <div css={styles.chatInput}>
        <div css={{ width: "80%" }}>
          <input
            type="text"
            css={styles.inputBox}
            placeholder="Type chat here.."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => { if (e.key === "Enter") handleSendMessage(); }}
          />
        </div>
        <div css={{ width: "20%", marginLeft: 20 }}>
          <button 
            css={styles.sendBtn}
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
      */}
    </>
  );
};
