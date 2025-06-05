import { create } from "zustand";
import type { GameState, RoomJoinedData } from "../types";

interface GameStore {
  gameState: GameState | null;
  roomData: RoomJoinedData | null;
  isConnected: boolean;
  isWaiting: boolean;

  setGameState: (state: GameState) => void;
  setRoomData: (data: RoomJoinedData) => void;
  setConnected: (connected: boolean) => void;
  setWaiting: (waiting: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: null,
  roomData: null,
  isConnected: false,
  isWaiting: false,

  setGameState: (state) => set({ gameState: state }),
  setRoomData: (data) => set({ roomData: data }),
  setConnected: (connected) => set({ isConnected: connected }),
  setWaiting: (waiting) => set({ isWaiting: waiting }),
  reset: () =>
    set({
      gameState: null,
      roomData: null,
      isConnected: false,
      isWaiting: false,
    }),
}));
