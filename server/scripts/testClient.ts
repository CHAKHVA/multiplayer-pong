import { io } from "socket.io-client";

const socket1 = io("http://localhost:3000");
const socket2 = io("http://localhost:3000");

socket1.on("connect", () => {
  console.log(`Client 1 connected: ${socket1.id}`);
  socket1.emit("joinGame");
});

socket1.on("waiting", () => {
  console.log("Client 1: Waiting for opponent...");
});

socket1.on("roomJoined", (data) => {
  console.log("Client 1: Room joined!", data);
});

socket2.on("connect", () => {
  console.log(`Client 2 connected: ${socket2.id}`);

  // Join after a short delay
  setTimeout(() => {
    socket2.emit("joinGame");
  }, 1000);
});

socket2.on("roomJoined", (data) => {
  console.log("Client 2: Room joined!", data);

  // Disconnect both after seeing the pairing
  setTimeout(() => {
    socket1.disconnect();
    socket2.disconnect();
    process.exit(0);
  }, 1000);
});
