import { css } from "@emotion/react";
import RoomEntry from "../components/RoomEntry";
import VideoContent from "../components/VideoContent";

const Home = () => (
  <div
    css={css`
      display: flex;
      padding: 0 12%;
      margin-top: 20vh;
      width: 100%;
      @media screen and (max-width: 1200px) {
        flex-direction: column;
      }
    `}
  >
    <RoomEntry />
    <VideoContent />
  </div>
);

export default Home;
