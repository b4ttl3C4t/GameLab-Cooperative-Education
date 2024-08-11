import { useEffect } from "react";
import Conference from "../components/Conference/Conference";
import NameBox from "../components/NameBox";
import { useClient } from "../hooks/useClient";
import { useLoaderData } from "react-router-dom";

const MeetRoom = () => {
  const data = useLoaderData();
  const id = (data as { id: string }).id;
  const { connect, connected, setMeetCode } = useClient();
  useEffect(() => {
    if (!connected && import.meta.env.VITE_ENDPOINT) {
      connect(import.meta.env.VITE_ENDPOINT);
    }
    setMeetCode(id);
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
