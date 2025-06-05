import { useSocket } from "../hooks/useSocket";
import {
  useCurrentGameState,
  useGameStatus,
  useGameStore,
  useWinner,
} from "../store/gameStore";

const GameOverOverlay = () => {
  const { getSocket } = useSocket();
  const status = useGameStatus();
  const gameState = useCurrentGameState();
  const winner = useWinner();
  const { requestRestart } = useGameStore();

  const handleRestartClick = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("restartGame");
      requestRestart(); // Update local status to 'awaitingRestart'
    }
  };

  if (status !== "gameOver" && status !== "awaitingRestart") {
    return null;
  }

  const winnerName = winner === "player1" ? "Player 1" : "Player 2";
  const finalScore =
    winner === "player1"
      ? `${gameState?.score.player1} – ${gameState?.score.player2}`
      : `${gameState?.score.player2} – ${gameState?.score.player1}`;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        zIndex: 10,
      }}
    >
      {status === "gameOver" && (
        <>
          <h1 style={{ fontSize: "48px", margin: "0 0 10px 0" }}>
            {winnerName} Wins!
          </h1>
          <p style={{ fontSize: "24px", margin: "0 0 30px 0" }}>
            Final Score: {finalScore}
          </p>
          <button
            onClick={handleRestartClick}
            style={{
              fontSize: "20px",
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Restart Game
          </button>
        </>
      )}

      {status === "awaitingRestart" && (
        <>
          <h2 style={{ fontSize: "32px", margin: 0 }}>
            Waiting for opponent...
          </h2>
          <p style={{ color: "#ccc", marginTop: "10px" }}>
            The game will restart when both players agree.
          </p>
        </>
      )}
    </div>
  );
};

export default GameOverOverlay;
