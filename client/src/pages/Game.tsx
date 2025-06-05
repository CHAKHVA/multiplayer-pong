import { useGameStore } from "../store/gameStore";

const Game = () => {
  const { roomData } = useGameStore();

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
      <h1>🎮 Game Screen</h1>
      {roomData && <p>Room ID: {roomData.roomId}</p>}
      <p>Game canvas will be implemented next!</p>
    </div>
  );
};

export default Game;
