import { Socket } from "socket.io";
import { GameRoom } from "./GameRoom";

export class GameManager {
  private static instance: GameManager;
  private rooms: Map<string, GameRoom> = new Map();
  private io: any;

  private constructor() {}

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public setIO(io: any): void {
    this.io = io;
  }

  public createRoom(roomId: string): GameRoom {
    const room = new GameRoom(roomId, this.io);
    this.rooms.set(roomId, room);
    return room;
  }

  public getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  public removeRoom(roomId: string): void {
    this.rooms.delete(roomId);
    console.log(`Room ${roomId} removed`);
  }

  public handlePlayerDisconnect(socket: Socket): void {
    // Find and remove player from their room
    for (const [roomId, room] of this.rooms.entries()) {
      room.removePlayer(socket.id);

      // Remove empty rooms
      if (room.getPlayerCount() === 0) {
        this.removeRoom(roomId);
      }
    }
  }
}
