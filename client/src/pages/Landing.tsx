import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useGameStore } from "../store/gameStore";

const Landing = () => {
  const navigate = useNavigate();
  const { connect } = useSocket();
  const { setConnected, setWaiting } = useGameStore();

  const handleJoinGame = () => {
    const socket = connect();

    socket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);

      // Join the game
      socket.emit("joinGame");
      setWaiting(true);

      // Navigate to waiting screen
      navigate("/waiting");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      alert("Failed to connect to server. Please try again.");
    });
  };

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
          fontSize: "3rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        🏓 Multiplayer Pong
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          marginBottom: "3rem",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: "1.6",
        }}
      >
        Challenge another player in real-time Pong! First to 5 points wins.
      </p>

      <button
        onClick={handleJoinGame}
        style={{
          fontSize: "1.5rem",
          padding: "1rem 2rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#45a049";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#4CAF50";
        }}
      >
        Join Game
      </button>
    </div>
  );
};

export default Landing;
