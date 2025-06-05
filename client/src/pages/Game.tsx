import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameCanvas from "../components/GameCanvas";
import GameOverOverlay from "../components/GameOverOverlay"; // Import the overlay
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { useSocket } from "../hooks/useSocket";
import {
  useCurrentGameState,
  useGameStatus,
  useGameStore,
  usePlayerIndex,
  useRoomId,
} from "../store/gameStore";
import type { GameState } from "../types";

const Game = () => {
  const navigate = useNavigate();
  const { getSocket } = useSocket();
  const playerIndex = usePlayerIndex();
  const roomId = useRoomId();
  const status = useGameStatus();
  const gameState = useCurrentGameState();
  const { setStatus, setGameState, endGame, confirmRestart, reset } =
    useGameStore();
  const listenersSetRef = useRef(false);

  useKeyboardControls({
    socket: getSocket(),
    playerIndex,
    enabled: status === "playing" && !gameState?.gameOver,
  });

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !socket.connected) {
      reset();
      navigate("/");
      return;
    }

    const validStatuses = ["playing", "gameOver", "awaitingRestart"];
    if (!validStatuses.includes(status)) {
      navigate("/");
      return;
    }

    if (listenersSetRef.current) return;
    listenersSetRef.current = true;

    const handleGameState = (state: GameState) => setGameState(state);
    const handleGameOver = (data: { winner: "player1" | "player2" }) =>
      endGame(data.winner);
    const handlePlayerDisconnected = () => {
      alert("Other player disconnected. Game ended.");
      reset();
      navigate("/");
    };
    // New listener for restart confirmation
    const handleRestartConfirmed = (initialState: GameState) => {
      console.log("Restart confirmed by server, new state:", initialState);
      confirmRestart(initialState);
    };

    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("playerDisconnected", handlePlayerDisconnected);
    socket.on("restartConfirmed", handleRestartConfirmed); // Add listener

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("gameOver", handleGameOver);
      socket.off("playerDisconnected", handlePlayerDisconnected);
      socket.off("restartConfirmed", handleRestartConfirmed); // Clean up listener
      listenersSetRef.current = false;
    };
  }, [
    status,
    navigate,
    getSocket,
    setGameState,
    endGame,
    confirmRestart,
    reset,
  ]);

  if (!["playing", "gameOver", "awaitingRestart"].includes(status)) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0" }}>🏓 Multiplayer Pong</h1>
        <p style={{ margin: "0", color: "#ccc" }}>
          You are Player {playerIndex} | Room: {roomId}
        </p>
      </div>

      {/* Use a relative container for the overlay */}
      <div style={{ position: "relative" }}>
        <GameCanvas width={800} height={600} />
        <GameOverOverlay />
      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#888",
          fontSize: "14px",
        }}
      >
        <p>
          {playerIndex === 1
            ? "Your controls: W (up) / S (down)"
            : "Your controls: ↑ (up) / ↓ (down)"}
        </p>
      </div>
    </div>
  );
};

export default Game;
