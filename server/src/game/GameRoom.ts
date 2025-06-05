import { Socket } from "socket.io";
import { GameState, Player } from "./types";

export class GameRoom {
  private players: Map<string, Player> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private gameState: GameState;
  private roomId: string;
  private io: any;

  // Game constants
  private readonly CANVAS_WIDTH = 800;
  private readonly CANVAS_HEIGHT = 600;
  private readonly BALL_SPEED = 5;
  private readonly PADDLE_HEIGHT = 100;

  constructor(roomId: string, io: any) {
    this.roomId = roomId;
    this.io = io;
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    return {
      ball: {
        x: this.CANVAS_WIDTH / 2,
        y: this.CANVAS_HEIGHT / 2,
      },
      paddles: {
        player1: {
          y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
        },
        player2: {
          y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
        },
      },
      score: {
        player1: 0,
        player2: 0,
      },
      gameOver: false,
    };
  }

  public addPlayer(socket: Socket, playerIndex: 1 | 2): void {
    const player: Player = {
      socket,
      id: socket.id,
      playerIndex,
    };

    this.players.set(socket.id, player);
    console.log(`Player ${playerIndex} added to room ${this.roomId}`);

    // Start game loop when we have 2 players
    if (this.players.size === 2) {
      this.startGameLoop();
    }
  }

  public removePlayer(socketId: string): void {
    const player = this.players.get(socketId);
    if (player) {
      this.players.delete(socketId);
      console.log(`Player removed from room ${this.roomId}`);

      // Stop game if any player disconnects
      this.stopGameLoop();

      // Notify remaining player
      this.players.forEach((remainingPlayer) => {
        remainingPlayer.socket.emit("playerDisconnected");
      });
    }
  }

  private startGameLoop(): void {
    console.log(`Starting game loop for room ${this.roomId}`);

    this.intervalId = setInterval(() => {
      this.tick();
    }, 16); // 60 FPS (1000ms / 60 ≈ 16ms)
  }

  private stopGameLoop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log(`Game loop stopped for room ${this.roomId}`);
    }
  }

  private tick(): void {
    // Update ball position (simple horizontal movement for now)
    this.gameState.ball.x += this.BALL_SPEED;

    // Simple ball bouncing off left/right walls (temporary logic)
    if (
      this.gameState.ball.x <= 0 ||
      this.gameState.ball.x >= this.CANVAS_WIDTH
    ) {
      // Reset ball to center for now
      this.gameState.ball.x = this.CANVAS_WIDTH / 2;
      this.gameState.ball.y = this.CANVAS_HEIGHT / 2;
    }

    // Emit game state to all players in the room
    this.io.to(this.roomId).emit("gameState", this.gameState);
  }

  public getPlayerCount(): number {
    return this.players.size;
  }

  public getRoomId(): string {
    return this.roomId;
  }
}
