import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

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

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected ${socket.id}`);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`HTTP server listening on ${PORT}`);
});
