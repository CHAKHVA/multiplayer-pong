import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import WaitingRoom from "./rooms/WaitingRoom";

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.send("ok");
});

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Get WaitingRoom singleton
const waitingRoom = WaitingRoom.getInstance();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected ${socket.id}`);

  // Handle player joining
  socket.on("joinGame", () => {
    const result = waitingRoom.registerPlayer(socket);

    if (result.playerIndex === 1) {
      // First player - waiting for opponent
      socket.emit("waiting");
      console.log(`Player 1 waiting in room ${result.roomId}`);
    } else {
      // Second player - game can start
      const roomId = result.roomId;

      // Emit to both players that room is ready
      io.to(roomId).emit("roomJoined", {
        roomId,
        player1Id: Array.from(io.sockets.adapter.rooms.get(roomId) || [])[0],
        player2Id: socket.id,
      });

      console.log(`Room ${roomId} created with 2 players`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected ${socket.id}`);

    // Remove from waiting room if they were waiting
    waitingRoom.removeWaitingPlayer(socket);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`HTTP server listening on ${PORT}`);
});
