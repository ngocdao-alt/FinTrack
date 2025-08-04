// src/utils/socket.ts
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("🔌 Connected to socket server");
    socket?.emit("session.start");
    
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from socket server");
  });

  socket.io.on("ping", () => {
  console.log("📤 Ping sent to server");
});
socket.io.on("pong", () => {
  console.log("📥 Pong received from server");
});

  return socket;
};

export const getSocket = () => socket;
