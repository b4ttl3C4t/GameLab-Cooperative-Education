import { css } from "@emotion/react";
import { Video } from "./Video";
import { Tool } from "./Tool";
import { Side } from "./Side";
import { io, Socket } from "socket.io-client";
import { useClient } from "../../hooks/useClient";
import { useParams, useNavigate} from "react-router-dom";
import { useState, useEffect } from 'react';

const styles = {
  container: css`
    margin: 0;
    top: 0;
    bottom: 0;
    display: flex;
    background-color: var(--white);
  `,
  leftSide: css`
    width: 80%;
    background-color: var(--black);
    height: 100vh;
    padding: 50px;
    text-align: center;
    position: relative;
  `,
  rightSide: css`
    width: 30%;
    background-color: #ffffff;
    height: 100vh;

    ::-webkit-scrollbar {
      width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgb(197, 197, 197);
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `,
};


type Message = {
  username: string;
  time: string;
  content: string;
};

export const Conference = () => {
  const { id } = useParams();
  const { username } = useClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  // 將資料類型設定為Socket跟null，使其能在連線後從初始化的null改為Socket
  const [messages, setMessages] = useState<Message[]>([]);
  const [attendees, setAttendees] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.once('connect', () => {
      console.log('Connected to server');
      newSocket.emit('ping');
    });

    newSocket.once('pong', (message) => {
      console.log(message);
      newSocket.emit('join room', id, username);
    });

    const handleAttendees = (attendees: string[]) => {
      const newAttendees = Object.values(attendees);
      setAttendees(newAttendees)
    }

    newSocket.on("attendees", handleAttendees);

    newSocket.on('message', (content, sender, time) => {
      console.log(`Received message: ${content} from ${sender} in time ${time}`);
      const newMessage: Message = {
        username: sender,
        time: new Date().toLocaleTimeString(),
        content: content,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      // ...會將prevMessages中所有元素展開到新陣列中
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id, username]);
  /* useEffect - 副作用處理:
   資料獲取、訂閱或手動方式修改 React Component DOM 都可以稱為副作用 (side effect)。
   基本結構用法：useEffect(callback(主要邏輯，最後可返回一個函數，用於清理工作), array(控制useEffect是否執行))
   array分為幾種情況:
   (1)如果是空的陣列，則只會執行一次 (初次 render 之後)，相當於 componentDidMount。
   (2)如果陣列內，我們有塞值進去，那麼useEffect會在該陣列發生改變後執行。
   (3)如果第二個參數陣列不填，useEffect會在每次畫面渲染時都會執行。
   */

  const handleSend = (content: string) => {
    if (socket && content.trim() !== "") {
      socket.emit('message', content, username, id);
    }
  };

  const leaveChat = () => {
    if (socket) {
      socket.disconnect();
      navigate(`/`); // 回到主頁面
    }
  }

  return (
    <div css={styles.container}>
      <div css={styles.leftSide}>
        <Video />
        <Tool leaveChat={leaveChat}/>
      </div>
      <div css={styles.rightSide}>
        <Side messages={messages} handleSend={handleSend} attendees={attendees}/>
      </div>
    </div>

  );
};

export default Conference;