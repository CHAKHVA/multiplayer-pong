export interface GameState {
  ball: {
    x: number;
    y: number;
  };
  paddles: {
    player1: {
      y: number;
    };
    player2: {
      y: number;
    };
  };
  score: {
    player1: number;
    player2: number;
  };
  gameOver: boolean;
  winner?: "player1" | "player2";
}

export interface Player {
  socket: any;
  id: string;
  playerIndex: 1 | 2;
}

export interface PaddleMoveEvent {
  dir: "up" | "down";
}

export interface RestartGameEvent {
  // Empty for now, just the event trigger
}
