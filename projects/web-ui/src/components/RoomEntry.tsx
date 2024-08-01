import { css } from "@emotion/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
    createJoin: css`
    width: 85%;
    margin-right: 50px;
    @media screen and (max-width: 1200px) {
      width: 100%;
      margin-right: 0;
    }
  `,
    text: css`
    .head {
      font-size: 36px;
      font-weight: bold;
      color: #393e46;
    }
    .subtext {
      font-size: 24px;
      color: #6f6f6f;
      margin-top: 10px;
    }
  `,
    joinRoom: css`
    margin-top: 20px;
    width: 100%;
    text-align: right;
    font-size: 24px;
    font-weight: bold;
    color: #232931;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  `,
    createBtn: css`
    width: 100%;
    margin-top: 60px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    background-color: #4ecca3;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    border: 2px solid #4ecca3;
    transition: 0.3s;
    color: white;

    &:hover {
      background-color: white;
      border: 2px solid #4ecca3;
      color: #4ecca3;
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }
  `,
    createBtnClicked: css`
    background-color: white;
    color: #4ecca3;
  `,
    roomCode: css`
    width: 100%;
    margin-top: 30px;
    font-size: 24px;
    color: #393e46;
    text-align: center;
    padding: 10px 0;
    border: none;
    border-bottom: 3px solid #232931;
    border-top: 2px solid white;
    font-weight: bold;

    &:focus {
      background-color: white;
      border: 0;
      border-bottom: 3px solid #232931;
      border-top: 2px solid white;
      outline: none;
      border-radius: 0;
    }
  `,
    unselectable: css`
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
  `,
};

const RoomEntry = () => {
    const navigate = useNavigate();
    const [meetCode, setMeetCode] = useState("");
    const isCodeError = useMemo(() => meetCode.trim() === "", [meetCode]);

    return (
        <div css={styles.createJoin}>
            <div css={styles.text}>
                <div className="head">Create or Join Video Meetings</div>
            </div>
            <button
                onClick={() => navigate(`/room/${Math.random().toString(16).slice(2)}`)}
                css={[styles.unselectable, styles.createBtn]}
            >
                Create Room
            </button>
            <br />
            <input
                type="text"
                name="room"
                spellCheck={false}
                placeholder="Enter Room Code"
                onChange={(e) => setMeetCode(e.target.value.trim())}
                css={[
                    styles.roomCode,
                    isCodeError &&
                    css`
              border-bottom-color: #d31c1c !important;
            `,
                ]}
            />
            <br />
            <div
                css={[styles.unselectable, styles.joinRoom]}
                onClick={() => {
                    if (isCodeError) return;
                    navigate(`/room/${meetCode}`);
                }}
            >
                Join Room
            </div>
        </div>
    );
};

export default RoomEntry;
