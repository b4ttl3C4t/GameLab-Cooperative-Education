import { useEffect } from "react";
import Conference from "../components/Conference/Conference";
import NameBox from "../components/NameBox";
import { useClient } from "../hooks/useClient";

const MeetRoom = () => {
    const { connect, connected, username, joinRoom } = useClient();
    useEffect(() => {
        //if (username) {
        //    if (!connected && import.meta.env.VITE_ENDPOINT) {
                
        //    }
        //    joinRoom();
        //}
    }, [connect, connected, joinRoom, username]);

    return (
        <>
            <NameBox />
            <Conference />
        </>
    );
};

export default MeetRoom;
