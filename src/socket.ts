import { io } from "socket.io-client";

const URL = "https://medmap-backend.up.railway.app";
export const socket = io(URL);

socket.on("connect", () => {
  console.log("Socket URL:  ", URL);

  console.log("✅ Connected to Socket.IO server! 🔌", socket.id);
});

socket.on("connection", () => {
  console.log("✅ Connected to Socket.IO server! 🔌", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection failed:", err.message);
});

// socket.on("disconnect", () => {
//   console.log("⚠️ Disconnected from server");
// });
