import { css } from "@emotion/react";
import { useClient } from "../hooks/useClient";
import { useRef } from "react";

const styles = {
  overlay: css`
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-color: var(--black);
  `,
  box: css`
    width: 25%;
    margin: 0 auto;
    height: 200px;
    background-color: #ffffff;
    margin-top: 100px;
    border-radius: 10px;
    text-align: center;
  `,
  head: css`
    padding-top: 20px;
    text-align: center;
    color: var(--black);
    font-weight: bold;
  `,
  nameField: css`
    margin: 0px auto;
    margin-top: 20px;
    border: none;
    font-weight: bold;
    padding: 10px;
    width: 90%;
    border-bottom: 3px solid var(--nicegreen);
    color: var(--black);
    height: 40px;

    &:focus {
      outline: none;
    }
  `,
  continueName: css`
    margin: 0px auto;
    margin-top: 30px;
    border: none;
    color: #ffffff;
    background-color: var(--nicegreen);
    padding: 12px 20px;
    border-radius: 10px;
    transition: opacity 0.5s;

    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }

    &:focus {
      outline: 0;
    }
  `,
};

const NameBox = () => {
  const nameRef = useRef<HTMLInputElement>(null);
    let { username, setUsername, joinRoom, setRoomId, roomId, connect} = useClient();
  return (
    <div css={[styles.overlay, { display: username && 'none'}]} id="overlay">
      <div css={styles.box}>
        <div css={styles.head}>Enter Your Username</div>
        <input
          css={styles.nameField}
          placeholder="Type here..."
          ref={nameRef}
        />
        <br />
        <button
          css={styles.continueName}
          onClick={() => {
              if (nameRef.current!.value) {
                  setUsername(nameRef.current.value);
                  let path = location.pathname.slice(6, 19);
                  roomId = path;
                  setRoomId(roomId);
                  console.log("Entered. ID:", roomId);
                  connect();
                  joinRoom();
              }
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default NameBox;
