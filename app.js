const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));



io.on("connection", (socket) => {
  // Room support (so each share link is its own board)
  let room = socket.handshake.query?.room || "default";
  socket.join(room);

  // forward draw events to everyone else in the same room, include sender id
  socket.on("draw", (data) => {
    socket.to(room).emit("draw", { ...data, id: socket.id });
  });

  // optional: clear / undo / redo / sticky events later
  socket.on("clear", () => socket.to(room).emit("clear"));
  socket.on("undo", () => socket.to(room).emit("undo"));
  socket.on("redo", () => socket.to(room).emit("redo"));

  // optional: sync request (new user asks someone to send canvas snapshot)
  socket.on("request-sync", () => socket.to(room).emit("send-canvas", { to: socket.id }));
//   socket.on("canvas-state", (payload) => {
//     // { to, dataURL }
//     io.to(payload.to).emit("canvas-state", { dataURL: payload.dataURL });
//   });
socket.on("canvas-state", (payload) => {
  // broadcast the snapshot to everyone else in the same room
  socket.to(room).emit("canvas-state", { dataURL: payload.dataURL });
});
});



const PORT = process.env.PORT || 3000;
server.listen(3000, () => console.log("server listening on http://localhost:" + 3000));