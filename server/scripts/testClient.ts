import { io } from "socket.io-client";

const socket1 = io("http://localhost:3000");
const socket2 = io("http://localhost:3000");

let gameStarted = false;
let moveInterval: NodeJS.Timeout;

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

socket1.on("gameState", (state) => {
  if (!gameStarted) {
    gameStarted = true;
    console.log("Game started! Ball and paddle positions will update...");

    // Start moving paddles randomly to test collision
    moveInterval = setInterval(() => {
      const moves = ["up", "down"];
      const randomMove = moves[Math.floor(Math.random() * moves.length)];

      if (Math.random() > 0.5) {
        socket1.emit("paddleMove", { dir: randomMove });
      }
      if (Math.random() > 0.5) {
        socket2.emit("paddleMove", { dir: randomMove });
      }
    }, 200);
  }

  // Log score updates
  if (state.score.player1 > 0 || state.score.player2 > 0) {
    console.log(
      `Score: Player 1: ${state.score.player1}, Player 2: ${state.score.player2}`
    );
  }
});

socket1.on("gameOver", (data) => {
  console.log(`🎉 GAME OVER! Winner: ${data.winner}`);
  console.log(
    `Final Score: Player 1: ${data.finalScore.player1}, Player 2: ${data.finalScore.player2}`
  );

  clearInterval(moveInterval);

  setTimeout(() => {
    socket1.disconnect();
    socket2.disconnect();
    process.exit(0);
  }, 2000);
});

socket2.on("connect", () => {
  console.log(`Client 2 connected: ${socket2.id}`);

  setTimeout(() => {
    socket2.emit("joinGame");
  }, 1000);
});

socket2.on("roomJoined", (data) => {
  console.log("Client 2: Room joined!", data);
});

socket2.on("gameOver", (data) => {
  console.log(`🎉 Client 2 - GAME OVER! Winner: ${data.winner}`);
});

// Safety disconnect after 30 seconds
setTimeout(() => {
  console.log("Test timeout - disconnecting clients...");
  clearInterval(moveInterval);
  socket1.disconnect();
  socket2.disconnect();
  process.exit(0);
}, 30000);
