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

let rooms: Record<string, any[]> = {};
let socketroom: Record<string, string> = {};
let socketname: Record<string, string> = {};
let micSocket: Record<string, "on" | "off"> = {};
let videoSocket: Record<string, "on" | "off"> = {};
let myColor: "hsl(0,0%,0%)";

app.use(cors());
app.get("/data", (req, res) => res.json({ message: "test" }));
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server run at http://localhost:${PORT}`);
});

io.on("connection", (client) => {
    client.on("ping", () => {
        client.emit("pong", "connected!");
        console.log("pong");
    });

    client.on("join room", (roomid, username, micOpened, camOpened) => {
        console.log("Here comes a new challenger,", username, "!");
        client.join(roomid);
        socketroom[client.id] = roomid;
        socketname[client.id] = username;
        micSocket[client.id] = micOpened ? "on" : "off";
        videoSocket[client.id] = camOpened ? "on" : "off";

        if (rooms[roomid] && rooms[roomid].length > 0) {
            rooms[roomid].push(client.id);
            client
                .to(roomid)
                .emit("message", `${username} joined the room.`, "Bot", myColor, Date.now());
            client
                .broadcast.to(roomid)
                .emit("newComing", "HI!");
            io.to(client.id).emit(
                "join room",
                rooms[roomid].filter((pid) => pid != client.id),
                socketname,
                micSocket,
                videoSocket
            );
        } else {
            rooms[roomid] = [client.id];
            io.to(client.id).emit("join room", null, null, null, null);
        }

        io.to(roomid).emit("user count", rooms[roomid].length);
    });

    client.on("action", (msg) => {
        if (msg == "mute") micSocket[client.id] = "off";
        else if (msg == "unmute") micSocket[client.id] = "on";
        else if (msg == "videoon") videoSocket[client.id] = "on";
        else if (msg == "videooff") videoSocket[client.id] = "off";

        client.to(socketroom[client.id]).emit("action", msg, client.id);
    });

    client.on("video-offer", (offer, sid) => {
        console.log("recieved offer");
        client
            .to(sid)
            .emit(
                "video-offer",
                offer,
                client.id,
                socketname[client.id],
                micSocket[client.id],
                videoSocket[client.id]
            );
    });

    client.on("video-answer", (answer, sid) => {
        client.to(sid).emit("video-answer", answer, client.id);
    });

    client.on("new icecandidate", (candidate, sid) => {
        client.to(sid).emit("new icecandidate", candidate, client.id);
    });

    client.on("message", (msg, username, roomid, color) => {
        console.log("Recieve message from:", username, " room id:", roomid, " content:", msg, " color:", color);
        io.to(roomid).emit("message", msg, username, color, Date.now());
    });

    client.on("image", (base64, username, roomid, color) => {
        console.log("Recieve image from:", username, " room id:", roomid, " content:", base64, " color:", color);
        io.to(roomid).emit("image", base64, username, color, Date.now());
    })

    client.on("disconnect", () => {
        if (!socketroom[client.id]) return;
        client
            .to(socketroom[client.id])
            .emit(
                "message",
                `${socketname[client.id]} left the chat.`,
                `Bot`,
                myColor,
                Date.now()
            );
        client.to(socketroom[client.id]).emit("remove peer", client.id);
        var index = rooms[socketroom[client.id]].indexOf(client.id);
        rooms[socketroom[client.id]].splice(index, 1);
        io.to(socketroom[client.id]).emit(
            "user count",
            rooms[socketroom[client.id]].length
        );
        delete socketroom[client.id];
        console.log("--------------------");
        console.log(rooms[socketroom[client.id]]);
    });
});
