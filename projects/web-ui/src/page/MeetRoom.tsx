import { useEffect } from "react";
import Conference from "../components/Conference/Conference";
import NameBox from "../components/NameBox";
import { useClient } from "../hooks/useClient";

const MeetRoom = () => {
  const { connect, connected } = useClient();
  useEffect(() => {
    if (!connected && import.meta.env.VITE_ENDPOINT) {
      connect(import.meta.env.VITE_ENDPOINT);
    }
  }, [connect, connected]);
  console.log(import.meta.env.VITE_ENDPOINT);
  return (
    <>
      <NameBox />
      <Conference />
    </>
  );
};

export default MeetRoom;
