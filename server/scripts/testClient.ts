import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(`Test client connected: ${socket.id}`);

  // Disconnect after 2 seconds
  setTimeout(() => {
    console.log("Test client disconnecting...");
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

socket.on("disconnect", () => {
  console.log("Test client disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  process.exit(1);
});
