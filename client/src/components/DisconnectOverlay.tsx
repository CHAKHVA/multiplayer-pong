import { useNavigate } from "react-router-dom";
import { useGameStatus, useGameStore } from "../store/gameStore";

const DisconnectOverlay = () => {
  const navigate = useNavigate();
  const status = useGameStatus();
  const { reset } = useGameStore();

  const handleReturnToMenu = () => {
    reset();
    navigate("/");
  };

  if (status !== "opponentDisconnected") {
    return null;
  }

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
        zIndex: 20, // Ensure it's on top
      }}
    >
      <h1 style={{ fontSize: "32px", margin: "0 0 20px 0" }}>
        Connection Lost
      </h1>
      <p style={{ fontSize: "18px", margin: "0 0 30px 0" }}>
        Other player disconnected. Game ended.
      </p>
      <button
        onClick={handleReturnToMenu}
        style={{
          fontSize: "20px",
          padding: "12px 24px",
          backgroundColor: "#f44336", // Red color for emphasis
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Return to Menu
      </button>
    </div>
  );
};

export default DisconnectOverlay;
