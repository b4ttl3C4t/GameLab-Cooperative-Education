import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const PORT = Number(process.env.PORT || 3000);
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
let rooms = {};
let socketroom = {};
let socketname = {};
let micSocket = {};
let videoSocket = {};
app.use(cors());
app.get("/data", (req, res) => res.json({ message: "test" }));
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server run at http://localhost:${PORT}`);
});
io.on("connection", (client) => {
    client.on("ping", () => {
        client.emit("pong", "connected!");
    });
    client.on("join room", (roomid, username) => {
        client.join(roomid);
        socketroom[client.id] = roomid;
        socketname[client.id] = username;
        micSocket[client.id] = "on";
        videoSocket[client.id] = "on";
        if (rooms[roomid] && rooms[roomid].length > 0) {
            rooms[roomid].push({ id: client.id, username: username });
            client
                .to(roomid)
                .emit("message", `${username} joined the room.`, "Bot", Date.now());
            io.to(client.id).emit("join room", rooms[roomid].filter((user) => user.id != client.id), socketname, micSocket, videoSocket);
        }
        else {
            rooms[roomid] = [{ id: client.id, username: username }];
            io.to(client.id).emit("join room", null, null, null, null);
        }
        io.to(roomid).emit("attendees", rooms[roomid]);
        io.to(roomid).emit("user count", rooms[roomid].length);
    });
    client.on("action", (msg) => {
        if (msg == "mute")
            micSocket[client.id] = "off";
        else if (msg == "unmute")
            micSocket[client.id] = "on";
        else if (msg == "videoon")
            videoSocket[client.id] = "on";
        else if (msg == "videooff")
            videoSocket[client.id] = "off";
        client.to(socketroom[client.id]).emit("action", msg, client.id);
    });
    client.on("video-offer", (offer, sid) => {
        client
            .to(sid)
            .emit("video-offer", offer, client.id, socketname[client.id], micSocket[client.id], videoSocket[client.id]);
    });
    client.on("video-answer", (answer, sid) => {
        client.to(sid).emit("video-answer", answer, client.id);
    });
    client.on("new icecandidate", (candidate, sid) => {
        client.to(sid).emit("new icecandidate", candidate, client.id);
    });
    client.on("message", (msg, username, roomid) => {
        io.to(roomid).emit("message", msg, username, Date.now());
    });
    client.on("disconnect", () => {
        if (!socketroom[client.id])
            return;
        client
            .to(socketroom[client.id])
            .emit("message", `${socketname[client.id]} left the chat.`, `Bot`, Date.now());
        client.to(socketroom[client.id]).emit("remove peer", client.id);
        var index = rooms[socketroom[client.id]].indexOf(client.id);
        rooms[socketroom[client.id]].splice(index, 1);
        io.to(socketroom[client.id]).emit("user count", rooms[socketroom[client.id]].length);
        delete socketname[client.id];
        delete micSocket[client.id];
        delete videoSocket[client.id];
        io.to(socketroom[client.id]).emit("attendees", rooms[socketroom[client.id]]);
        delete socketroom[client.id];
        console.log("--------------------");
        console.log(rooms[socketroom[client.id]]);
    });
});
