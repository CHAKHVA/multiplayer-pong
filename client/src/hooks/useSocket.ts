import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");
      console.log("Socket connecting...");
    }
    return socketRef.current;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("Socket disconnected");
    }
  };

  const getSocket = () => socketRef.current;

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    getSocket,
  };
};
