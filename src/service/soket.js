// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://38.242.230.126:4457", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
