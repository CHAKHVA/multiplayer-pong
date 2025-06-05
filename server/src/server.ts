import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameManager } from "./game/GameManager";
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

// Get singletons
const waitingRoom = WaitingRoom.getInstance();
const gameManager = GameManager.getInstance();
gameManager.setIO(io);

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
      // Second player - create game room and start
      const roomId = result.roomId;
      const gameRoom = gameManager.createRoom(roomId);

      // Get both player sockets
      const roomSockets = Array.from(
        io.sockets.adapter.rooms.get(roomId) || []
      );
      const player1Socket = io.sockets.sockets.get(roomSockets[0]);
      const player2Socket = socket;

      // Add players to game room
      if (player1Socket) {
        gameRoom.addPlayer(player1Socket, 1);
      }
      gameRoom.addPlayer(player2Socket, 2);

      // Emit to both players that room is ready
      io.to(roomId).emit("roomJoined", {
        roomId,
        player1Id: roomSockets[0],
        player2Id: socket.id,
      });

      console.log(`Game room ${roomId} created and started`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected ${socket.id}`);

    // Remove from waiting room if they were waiting
    waitingRoom.removeWaitingPlayer(socket);

    // Handle game room disconnect
    gameManager.handlePlayerDisconnect(socket);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`HTTP server listening on ${PORT}`);
});
