import { Socket } from "socket.io";

interface PairingResult {
  roomId: string;
  playerIndex: 1 | 2;
}

class WaitingRoom {
  private static instance: WaitingRoom;
  private waitingSocket: Socket | null = null;

  private constructor() {}

  public static getInstance(): WaitingRoom {
    if (!WaitingRoom.instance) {
      WaitingRoom.instance = new WaitingRoom();
    }
    return WaitingRoom.instance;
  }

  public registerPlayer(socket: Socket): PairingResult {
    if (this.waitingSocket === null) {
      // First player - put them in waiting
      this.waitingSocket = socket;
      const roomId = this.generateRoomId();

      return {
        roomId,
        playerIndex: 1,
      };
    } else {
      // Second player - pair them up
      const roomId = this.generateRoomId();
      const firstSocket = this.waitingSocket;

      // Clear waiting socket
      this.waitingSocket = null;

      // Join both sockets to the room
      firstSocket.join(roomId);
      socket.join(roomId);

      // Return pairing result for second player
      return {
        roomId,
        playerIndex: 2,
      };
    }
  }

  public removeWaitingPlayer(socket: Socket): void {
    if (this.waitingSocket === socket) {
      this.waitingSocket = null;
    }
  }

  private generateRoomId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default WaitingRoom;
