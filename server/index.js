const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

server.listen(5000, () => {
    console.log("Server running on Port 5000...");
});


io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("User successfuly joined room: " + data);
    });

    socket.on("send_msg", (data) => {
        console.log(data);
        socket.to(data.group).emit("receive_msg", data.content);        
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});