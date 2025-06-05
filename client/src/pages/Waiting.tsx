import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useGameStore } from "../store/gameStore";
import type { RoomJoinedData } from "../types";

const Waiting = () => {
  const navigate = useNavigate();
  const { getSocket } = useSocket();
  const { setRoomData, setWaiting, isWaiting } = useGameStore();

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      // If no socket connection, redirect to landing
      navigate("/");
      return;
    }

    const handleWaiting = () => {
      console.log("Waiting for another player...");
    };

    const handleRoomJoined = (data: RoomJoinedData) => {
      console.log("Room joined:", data);
      setRoomData(data);
      setWaiting(false);
      navigate("/game");
    };

    const handlePlayerDisconnected = () => {
      alert("Other player disconnected. Returning to main menu.");
      navigate("/");
    };

    // Set up event listeners
    socket.on("waiting", handleWaiting);
    socket.on("roomJoined", handleRoomJoined);
    socket.on("playerDisconnected", handlePlayerDisconnected);

    // Cleanup function
    return () => {
      socket.off("waiting", handleWaiting);
      socket.off("roomJoined", handleRoomJoined);
      socket.off("playerDisconnected", handlePlayerDisconnected);
    };
  }, [navigate, getSocket, setRoomData, setWaiting]);

  if (!isWaiting) {
    return null; // Will redirect
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        🔍 Finding Opponent
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #4CAF50",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p
          style={{
            fontSize: "1.3rem",
          }}
        >
          Waiting for another player to join...
        </p>
      </div>

      <p
        style={{
          fontSize: "1rem",
          color: "#888",
          textAlign: "center",
        }}
      >
        You'll be automatically matched when someone else joins!
      </p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Waiting;
