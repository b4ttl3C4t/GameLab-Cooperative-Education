import { css } from "@emotion/react";
import { Video } from "./Video";
import { Tool } from "./Tool";
import { Side } from "./Side";

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

const Conference = () => {
  return (
    <div css={styles.container}>
      <div css={styles.leftSide}>
        <Video />
        <Tool />
      </div>
      <div css={styles.rightSide}>
        <Side />
      </div>
    </div>
  );
};

export default Conference;
