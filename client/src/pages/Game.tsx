import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameCanvas from "../components/GameCanvas";
import { useKeyboardControls } from "../hooks/useKeyboardControl";
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
  const { setStatus, setGameState, endGame } = useGameStore();
  const listenersSetRef = useRef(false);
  const keyboardListenerSetRef = useRef(false);

  // Throttling refs
  const lastEmitTimeRef = useRef(0);
  const EMIT_THROTTLE_MS = 1000 / 60; // 60 Hz = ~16.67ms

  useEffect(() => {
    // Redirect if not in playing status
    if (status !== "playing") {
      setStatus("landing");
      navigate("/");
      return;
    }

    const socket = getSocket();
    if (!socket || !socket.connected) {
      setStatus("landing");
      navigate("/");
      return;
    }

    // Prevent duplicate listeners
    if (listenersSetRef.current) return;
    listenersSetRef.current = true;

    const handleGameState = (state: GameState) => {
      setGameState(state);
    };

    const handleGameOver = (data: {
      winner: "player1" | "player2";
      finalScore: any;
    }) => {
      endGame(data.winner);
    };

    const handlePlayerDisconnected = () => {
      alert("Other player disconnected. Game ended.");
      setStatus("landing");
      navigate("/");
    };

    // Set up event listeners
    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("playerDisconnected", handlePlayerDisconnected);

    console.log("Game page: Socket listeners set up");

    // Cleanup function
    return () => {
      if (socket) {
        socket.off("gameState", handleGameState);
        socket.off("gameOver", handleGameOver);
        socket.off("playerDisconnected", handlePlayerDisconnected);
      }
      listenersSetRef.current = false;
      console.log("Game page: Socket listeners cleaned up");
    };
  }, [status, navigate, setStatus, getSocket, setGameState, endGame]);

  // Keyboard input handling
  useKeyboardControls({
    socket: getSocket(),
    playerIndex,
    enabled: status === "playing",
  });

  if (status !== "playing") {
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
        {gameState && (
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#888" }}>
            Score: {gameState.score.player1} - {gameState.score.player2}
          </p>
        )}
      </div>

      <GameCanvas width={800} height={600} />

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
        <p style={{ marginTop: "5px", fontSize: "12px" }}>
          {playerIndex === 1 ? "Opponent: ↑ / ↓" : "Opponent: W / S"}
        </p>
      </div>
    </div>
  );
};

export default Game;
